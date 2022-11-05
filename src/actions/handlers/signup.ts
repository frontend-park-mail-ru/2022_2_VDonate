import {ActionType} from '@actions/types/action';
import {ResponseData} from '@api/ajax';
import api from '@app/api';
import router from '@app/router';
import store from '@app/store';
import {SignUpForm} from '@actions/types/signup';

export default (props: SignUpForm): void => {
  // TODO валидация
  api.signupUser(props.username.value, props.email.value, props.password.value)
      .then((res: ResponseData) => {
        switch (res.status) {
          case 200:
            store.dispatch({
              type: ActionType.SIGNUP_SUCCESS,
              payload: {
                signup: {
                  id: res.body.id as number,
                },
                location: {
                  type: router.go('/feed'),
                },
                formStatus: {
                  emailErr: null,
                  usernameErr: null,
                  passwordErr: null,
                  passwordRepeatErr: null,
                },
              },
            });
            break;
          case 405:
            store.dispatch({
              type: ActionType.SIGNUP_FAIL,
              payload: {
                emailErr: 'Неверная почта',
                usernameErr: 'Неверный псевдоним или пароль',
                passwordErr: 'Неверный псевдоним или пароль',
                passwordRepeatErr: null,
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
