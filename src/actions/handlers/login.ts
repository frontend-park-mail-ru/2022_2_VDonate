import {ActionType} from '@actions/types/action';
import {ResponseData} from '@api/ajax';
import api from '@app/api';
import {LogInForm} from '@actions/types/login';
import router from '@app/router';
import store from '@app/store';

export default (props: LogInForm): void => {
  // TODO валидация
  api.loginUser(props.username.value, props.password.value)
      .then((res: ResponseData) => {
        switch (res.status) {
          case 200:
            store.dispatch({
              type: ActionType.LOGIN_SUCCESS,
              payload: {
                login: {
                  id: res.body.id as number,
                },
                location: {
                  type: router.go('/feed'),
                },
                formStatus: {
                  usernameErr: null,
                  passwordErr: null,
                },
              },
            });
            break;
          case 404:
            store.dispatch({
              type: ActionType.LOGIN_FAIL,
              payload: {
                usernameErr: 'Неверный псевдоним или пароль',
                passwordErr: 'Неверный псевдоним или пароль',
              },
            });
            break;
          case 0:
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: res.body.error as string,
              },
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
