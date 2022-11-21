import {ResponseData, saveCSRF} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import {
  PayloadEditUser,
  PayloadEditUserSucces,
  PayloadUser} from '@actions/types/user';
import router from '@app/router';
import store from '@app/store';
import api from '@app/api';
import {PayloadNotice} from '@actions/types/notice';
import {
  emailCheck,
  passwordCheck,
  repeatPasswordCheck,
  usernameCheck} from '@validation/validation';
import {FormErrorType} from '@actions/types/formError';


export interface SignUpForm extends HTMLCollection {
  email: HTMLInputElement
  username: HTMLInputElement
  password: HTMLInputElement
  repeatPassword: HTMLInputElement
}

export interface LogInForm extends HTMLCollection {
  username: HTMLInputElement
  password: HTMLInputElement
}

export interface EditUserForm extends HTMLCollection {
  email: HTMLInputElement
  username: HTMLInputElement
  password: HTMLInputElement
  repeatPassword: HTMLInputElement
  isAuthor?: HTMLInputElement
  about?: HTMLTextAreaElement
  avatar?: HTMLInputElement
}

const getUser = (id: number, dispatch: (user: PayloadUser) => void) => {
  return api.getUser(id)
      .then((res: ResponseData) => {
        if (res.ok) {
          const payload: PayloadUser = {
            id: id,
            avatar: res.body.avatar as PayloadUser['avatar'],
            isAuthor: res.body.isAuthor as PayloadUser['isAuthor'],
            username: res.body.username as PayloadUser['username'],
            email: res.body.email as PayloadUser['email'],
            countSubscriptions:
              res.body.countSubscriptions as PayloadUser['countSubscriptions'],
          };
          if (res.body.isAuthor) {
            payload.countSubscribers =
                  res.body.countSubscribers as PayloadUser['countSubscribers'];
            payload.about =
                  res.body.about as PayloadUser['about'];
          }
          dispatch(payload);
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: res.body.message as string,
            },
          });
        }
      },
      );
};

export const auth = (): void => {
  api.authUser()
      .then((res: ResponseData) => {
        if (!saveCSRF()) {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: 'CSRF токен не получен',
            },
          });
          return;
        }
        if (res.ok) {
          return getUser(
            res.body.id as number,
            (user: PayloadUser) => {
              if (location.pathname === '/') {
                history.replaceState(null, '', '/feed');
              }
              store.dispatch({
                type: ActionType.AUTH,
                payload: {
                  user,
                  location: {
                    type: router.go(location.pathname + location.search),
                  },
                },
              });
            });
        }
        store.dispatch({
          type: ActionType.ROUTING,
          payload: {
            type: router.go('/login'),
          },
        });
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
      });
};

export const login = (props: LogInForm): void => {
  const usernameErr = usernameCheck(props.username.value);
  const passwordErr = passwordCheck(props.password.value);
  if (usernameErr || passwordErr) {
    store.dispatch({
      type: ActionType.LOGIN_FAIL,
      payload: {
        type: FormErrorType.LOGIN,
        username: usernameErr,
        password: passwordErr,
      },
    });
    return;
  }
  api.loginUser(props.username.value, props.password.value)
      .then((res: ResponseData) => {
        if (!saveCSRF()) {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: 'CSRF токен не получен',
            },
          });
          return;
        }
        switch (res.status) {
          case 200:
            return getUser(
                res.body.id as PayloadUser['id'],
                (user: PayloadUser) => {
                  store.dispatch({
                    type: ActionType.LOGIN_SUCCESS,
                    payload: {
                      user,
                      location: {
                        type: router.go('/feed'),
                      },
                      formErrors: {
                        type: FormErrorType.LOGIN,
                        username: null,
                        password: null,
                      },
                    },
                  });
                });
          case 404:
            store.dispatch({
              type: ActionType.LOGIN_FAIL,
              payload: {
                type: FormErrorType.LOGIN,
                username: 'Неверный псевдоним или пароль',
                password: 'Неверный псевдоним или пароль',
              },
            });
            break;
          case 0:
            store.dispatch({
              type: ActionType.NOTICE,
              payload: res.body as PayloadNotice,
            });
            break;
          default:
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: `Неизвестный статус ${res.status}`,
              },
            });
            break;
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
      });
};
export const signup = (props: SignUpForm): void => {
  const emailErr = emailCheck(props.email.value);
  const usernameErr = usernameCheck(props.username.value);
  const passwordErr = passwordCheck(props.password.value);
  const repeatPasswordErr = repeatPasswordCheck(
      props.password.value,
      props.repeatPassword.value);
  if (emailErr || usernameErr || passwordErr || repeatPasswordErr) {
    store.dispatch({
      type: ActionType.SIGNUP_FAIL,
      payload: {
        type: FormErrorType.SIGNUP,
        email: emailErr,
        username: usernameErr,
        password: passwordErr,
        repeatPassword: repeatPasswordErr,
      },
    });
    return;
  }
  api.signupUser(props.username.value, props.email.value, props.password.value)
      .then((res: ResponseData) => {
        if (!saveCSRF()) {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: 'CSRF токен не получен',
            },
          });
          return;
        }
        switch (res.status) {
          case 200:
            return getUser(
              res.body.id as PayloadUser['id'],
              (user: PayloadUser) => {
                store.dispatch({
                  type: ActionType.SIGNUP_SUCCESS,
                  payload: {
                    user,
                    location: {
                      type: router.go('/feed'),
                    },
                    formErrors: {
                      type: FormErrorType.SIGNUP,
                      email: null,
                      username: null,
                      password: null,
                      repeatPassword: null,
                    },
                  },
                });
              });
          case 405:
            store.dispatch({
              type: ActionType.SIGNUP_FAIL,
              payload: {
                type: FormErrorType.SIGNUP,
                email: 'Неверная почта',
                username: 'Неверный псевдоним или пароль',
                password: 'Неверный псевдоним или пароль',
                repeatPassword: null,
              },
            });
            break;
          case 0:
            store.dispatch({
              type: ActionType.NOTICE,
              payload: res.body as PayloadNotice,
            });
            break;
          default:
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: `Неизвестный статус ${res.status}`,
              },
            });
            break;
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
      });
};

export const logout = (): void => {
  api.logout()
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.LOGOUT_SUCCESS,
            payload: {
              location: {
                type: router.go('/login'),
              },
            },
          });
        } else {
          store.dispatch({
            type: ActionType.LOGOUT_FAIL,
            payload: {
              message: res.body.message as string | 'Error',
            },
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
      });
};

export const editUser = (id: number, form: EditUserForm): void => {
  const userData: PayloadEditUser = {
    id: id,
  };
  if (form.username.value != '') {
    userData.username = form.username.value;
  }
  if (form.email.value != '') {
    userData.email = form.email.value;
  }
  if (form.password.value != '') {
    userData.password = form.password.value;
    userData.repeatPassword = form.repeatPassword.value;
  }
  if (form.isAuthor?.checked) {
    userData.isAuthor = true;
  }
  if (form.avatar?.files) {
    userData.file = form.avatar.files[0];
  }
  userData.about = form.about?.value;
  const emailErr = userData.email ? emailCheck(userData.email) : null;
  const usernameErr =
    userData.username ? usernameCheck(userData.username) : null;
  const passwordErr =
    userData.password ? passwordCheck(userData.password) : null;
  const repeatPasswordErr =
    userData.password ? repeatPasswordCheck(
        userData.password,
        userData.repeatPassword ?? '') : null;
  if (emailErr || usernameErr || passwordErr || repeatPasswordErr) {
    store.dispatch({
      type: ActionType.CHANGEUSERDATA_FAIL,
      payload: {
        type: FormErrorType.EDIT_USER,
        email: emailErr,
        username: usernameErr,
        password: passwordErr,
        repeatPassword: repeatPasswordErr,
        isAuthor: null,
        about: null,
        avatar: null,
      },
    });
    return;
  }
  api.putUserData(userData)
      .then((res: ResponseData) => {
        if (res.ok) {
          const user: PayloadEditUserSucces = {
            id: userData.id,
          };
          if (res.body.imgPath && res.body.imgPath !== '') {
            user.avatar = res.body.imgPath as string;
          }
          if (userData.username) {
            user.username = userData.username;
          }
          if (userData.email) {
            user.email = userData.email;
          }
          if (userData.isAuthor) {
            user.isAuthor = userData.isAuthor;
          }
          if (userData.about) {
            user.about = userData.about;
          }
          store.dispatch({
            type: ActionType.CHANGEUSERDATA_SUCCESS,
            payload: {
              user,
              formErrors: {
                type: FormErrorType.EDIT_USER,
                email: null,
                username: null,
                password: null,
                repeatPassword: null,
                isAuthor: null,
                about: null,
                avatar: null,
              },
            },
          });
        } else {
          store.dispatch({
            type: ActionType.CHANGEUSERDATA_FAIL,
            payload: {
              type: FormErrorType.EDIT_USER,
              email: 'Неверная почта',
              username: 'Неверный псевдоним или пароль',
              password: 'Неверный псевдоним или пароль',
              repeatPassword: null,
              isAuthor: 'Error',
              about: 'Error',
              avatar: 'Error',
            },
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
      });
};
