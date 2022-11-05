import {ActionType} from '@actions/types/action';
import {ResponseData} from '@api/ajax';
import api from '@app/api';
import router from '@app/router';
import store from '@app/store';
import {SignUpForm} from '@actions/types/signup';
import {
  emailCheck,
  passwordCheck,
  repeatPasswordCheck,
  usernameCheck} from '@validation/validation';

export default (props: SignUpForm): void => {
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
                formErrors: {
                  email: null,
                  username: null,
                  password: null,
                  repeatPassword: null,
                },
              },
            });
            break;
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
