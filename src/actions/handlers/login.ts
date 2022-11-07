import {ActionType} from '@actions/types/action';
import {ResponseData} from '@api/ajax';
import api from '@app/api';
import {LogInForm, PayloadLogInSuccess} from '@actions/types/login';
import router from '@app/router';
import store from '@app/store';
import {passwordCheck, usernameCheck} from '@validation/validation';
import {PayloadNotice} from '@actions/types/notice';

export default (props: LogInForm): void => {
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
        switch (res.status) {
          case 200:
            store.dispatch({
              type: ActionType.LOGIN_SUCCESS,
              payload: {
                login: res.body as PayloadLogInSuccess,
                location: {
                  type: router.go('/feed'),
                },
                formErrors: {
                  username: null,
                  password: null,
                },
              },
            });
            break;
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
      .catch(() => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: 'error fetch',
          },
        });
      });
};
