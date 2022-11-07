import {ResponseData, saveCSRF} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import {PayloadUser} from '@actions/types/user';
import router from '@app/router';
import store from '@app/store';
import api from '@app/api';
import {PayloadNotice} from '@actions/types/notice';
import {
  emailCheck,
  passwordCheck,
  repeatPasswordCheck,
  usernameCheck} from '@validation/validation';


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

const getUser = (id: number, dispatch: (user: PayloadUser) => void) => {
  return api.getUser(id)
      .then(
          (res: ResponseData) => {
            if (res.ok) {
              const payload: PayloadUser = {
                id: id,
                avatar: res.body.avatar as PayloadUser['avatar'],
                isAuthor: res.body.is_author as PayloadUser['isAuthor'],
                username: res.body.username as PayloadUser['username'],
                email: res.body.email as PayloadUser['email'],
                countSubscriptions:
              res.body.countSubscriptions as PayloadUser['countSubscriptions'],
              };
              if (res.body.is_author) {
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
      .catch(() => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: 'error fetch',
          },
        });
      });
};
