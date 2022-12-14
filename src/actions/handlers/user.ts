import {ResponseData, saveCSRF} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import {
  PayloadEditUser,
  PayloadEditUserSuccess,
  PayloadUser} from '@actions/types/user';
import router from '@app/Router';
import store from '@app/Store';
import api from '@app/Api';
import ws from '@app/WebSocketNotice';
import {PayloadNotice} from '@actions/types/notice';
import {
  emailCheck,
  passwordCheck,
  repeatPasswordCheck,
  usernameCheck} from '@validation/validation';
import {FormErrorType} from '@actions/types/formError';
import {Pages} from '@configs/router';


export interface SignUpFormElements extends HTMLCollection {
  email: HTMLInputElement
  username: HTMLInputElement
  password: HTMLInputElement
  repeatPassword: HTMLInputElement
}

export interface LogInFormElements extends HTMLCollection {
  username: HTMLInputElement
  password: HTMLInputElement
}

export interface EditUserFormElements extends HTMLCollection {
  email: HTMLInputElement
  username: HTMLInputElement
  password: HTMLInputElement
  repeatPassword: HTMLInputElement
  isAuthor?: HTMLInputElement
  about?: HTMLTextAreaElement
  avatar?: HTMLInputElement
}

export interface WithdrawFormElements extends HTMLCollection {
  phone?: HTMLInputElement
  card?: HTMLInputElement
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
          switch (res.status) {
            case 404:
              store.dispatch({
                type: ActionType.ROUTING,
                payload: {
                  type: Pages.NOT_FOUND,
                  options: {},
                },
              });
              break;
            case 401:
              return auth();
            default:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: res.body.message as string,
                },
              });
              break;
          }
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
              message: 'CSRF ?????????? ???? ??????????????',
            },
          });
          return;
        }
        if (res.ok) {
          ws.init(res.body.id as number);
          return getUser(
            res.body.id as number,
            (user: PayloadUser) => {
              switch (location.pathname) {
                case '/':
                case '/login':
                case '/signup':
                  history.replaceState(null, '', '/feed');
                  break;
                default:
                  break;
              }
              store.dispatch({
                type: ActionType.AUTH,
                payload: {
                  user,
                  location: {
                    type: router.go(location.pathname + location.search),
                    options: {},
                  },
                },
              });
            });
        }
        store.dispatch({
          type: ActionType.ROUTING,
          payload: {
            type: router.go('/login'),
            options: {},
          },
        });
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
      });
};

export const login = (props: LogInFormElements): void => {
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
              message: 'CSRF ?????????? ???? ??????????????',
            },
          });
          return;
        }
        switch (res.status) {
          case 200:
            ws.init(res.body.id as number);
            return getUser(
                res.body.id as PayloadUser['id'],
                (user: PayloadUser) => {
                  store.dispatch({
                    type: ActionType.LOGIN_SUCCESS,
                    payload: {
                      user,
                      location: {
                        type: router.go('/feed'),
                        options: {},
                      },
                      formErrors: {
                        type: FormErrorType.LOGIN,
                        username: null,
                        password: null,
                      },
                    },
                  });
                });
          case 400:
            store.dispatch({
              type: ActionType.LOGIN_FAIL,
              payload: {
                type: FormErrorType.LOGIN,
                username: null,
                password: '???????????????? ????????????',
              },
            });
            break;
          case 404:
            store.dispatch({
              type: ActionType.LOGIN_FAIL,
              payload: {
                type: FormErrorType.LOGIN,
                username: '???????????????? ??????????????????',
                password: null,
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
                message: `?????????????????????? ???????????? ${res.status}`,
              },
            });
            break;
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
      });
};
export const signup = (props: SignUpFormElements): void => {
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
              message: 'CSRF ?????????? ???? ??????????????',
            },
          });
          return;
        }
        switch (res.status) {
          case 200:
            ws.init(res.body.id as number);
            return getUser(
              res.body.id as PayloadUser['id'],
              (user: PayloadUser) => {
                store.dispatch({
                  type: ActionType.SIGNUP_SUCCESS,
                  payload: {
                    user,
                    location: {
                      type: router.go('/feed'),
                      options: {},
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
          case 409:
            switch (res.body.message as string) {
              case 'email exists':
                store.dispatch({
                  type: ActionType.SIGNUP_FAIL,
                  payload: {
                    type: FormErrorType.SIGNUP,
                    email: '?????????? ?????? ????????????',
                    username: null,
                    password: null,
                    repeatPassword: null,
                  },
                });
                break;
              case 'username exists':
                store.dispatch({
                  type: ActionType.SIGNUP_FAIL,
                  payload: {
                    type: FormErrorType.SIGNUP,
                    email: null,
                    username: '?????????????????? ?????? ??????????',
                    password: null,
                    repeatPassword: null,
                  },
                });
                break;
              default:
                store.dispatch({
                  type: ActionType.SIGNUP_FAIL,
                  payload: {
                    type: FormErrorType.SIGNUP,
                    email: '???????????????? ??????????',
                    username: '???????????????? ?????????????????? ?????? ????????????',
                    password: '???????????????? ?????????????????? ?????? ????????????',
                    repeatPassword: null,
                  },
                });
            }
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
                message: `?????????????????????? ???????????? ${res.status}`,
              },
            });
            break;
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
      });
};

export const logout = (): void => {
  api.logout()
      .then((res: ResponseData) => {
        if (res.ok) {
          ws.close();
          store.dispatch({
            type: ActionType.LOGOUT_SUCCESS,
            payload: {
              location: {
                type: router.go('/login'),
                options: {},
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
            message: err as Error,
          },
        });
      });
};

export const editUser = (id: number, form: EditUserFormElements): void => {
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
  if (form.avatar?.files) {
    userData.file = form.avatar.files[0];
  }
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
      type: ActionType.CHANGE_USERDATA_FAIL,
      payload: {
        type: FormErrorType.EDIT_USER,
        email: emailErr,
        username: usernameErr,
        password: passwordErr,
        repeatPassword: repeatPasswordErr,
        avatar: null,
      },
    });
    return;
  }
  api.putUserData(userData)
      .then((res: ResponseData) => {
        if (res.ok) {
          const user: PayloadEditUserSuccess = {
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
          store.dispatch({
            type: ActionType.CHANGE_USERDATA_SUCCESS,
            payload: {
              user,
              formErrors: {
                type: FormErrorType.EDIT_USER,
                email: null,
                username: null,
                password: null,
                repeatPassword: null,
                avatar: null,
              },
            },
          });
        } else {
          switch (res.status) {
            case 401:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: res.body.message as string,
                },
              });
              break;
            case 500:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: '???????????? ??????????????',
                },
              });
              break;
            default:
              store.dispatch({
                type: ActionType.CHANGE_USERDATA_FAIL,
                payload: {
                  type: FormErrorType.EDIT_USER,
                  email: '???????????????? ??????????',
                  username: '???????????????? ?????????????????? ?????? ????????????',
                  password: '???????????????? ?????????????????? ?????? ????????????',
                  repeatPassword: null,
                  avatar: 'Error',
                },
              });
          }
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
      });
};

export const editAbout = (id: number, about: string): void => {
  about = about.trim();
  if (about.length > 1000) {
    store.dispatch({
      type: ActionType.NOTICE,
      payload: {
        message: '???????? \'?????? ??????\' ???????????? ?????????????????? ???????????? 1000 ????????????????',
      },
    });
    return;
  }
  if (about.length == 0) {
    store.dispatch({
      type: ActionType.NOTICE,
      payload: {
        message: '???????? \'?????? ??????\' ???????????? ?????????????????? 1 ?????? ???????????? ????????????????',
      },
    });
    return;
  }
  api.putUserData({
    id,
    about,
  })
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.EDIT_ABOUT,
            payload: {
              about,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: '???????????? ?????? ?????????????????? ???????? ?? ??????',
            },
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
      });
};

export const becomeAuthor = (id: number): void => {
  api.putUserData({
    id,
    isAuthor: true,
  })
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.BECOME_AUTHOR,
            payload: {
              success: true,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: '???????????? ?????? ?????????????????????? ??????????????',
            },
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
      });
};

export const withdraw = (data: WithdrawFormElements): void => {
  let isPhone: boolean;
  let text: string;
  if (data.card) {
    isPhone = false;
    text = data.card.value;
    if (text.length !== 16) {
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: '???????????????????????? ?????????? ???????????? ??????????',
        },
      });
      return;
    }
  } else if (data.phone) {
    isPhone = true;
    text = data.phone.value;
    if (text.length !== 11) {
      store.dispatch({
        type: ActionType.WITHDRAW_ERROR,
        payload: {
          type: FormErrorType.WITHDRAW,
          message: '???????????????????????? ?????????? ???????????? ????????????????',
        },
      });
      return;
    }
  } else {
    store.dispatch({
      type: ActionType.WITHDRAW_ERROR,
      payload: {
        type: FormErrorType.WITHDRAW,
        message: '???????????? ?????? ???????????????? ??????????, ?????????????????? ?????????????? ??????????',
      },
    });
    return;
  }
  api.withdraw((store.getState().user as PayloadUser).id, isPhone, text)
      .then((res) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.WITHDRAW,
            payload: {},
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: res.body.message as string,
            },
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
      });
};
