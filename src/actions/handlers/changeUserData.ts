import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/store';
import {PayloadChangeUserData} from '@actions/types/changeUserData';
import {
  emailCheck,
  passwordCheck,
  repeatPasswordCheck,
  usernameCheck} from '@validation/validation';

export default (props: PayloadChangeUserData): void => {
  const emailErr = props.email ? emailCheck(props.email) : null;
  const usernameErr =
    props.username ? usernameCheck(props.username) : null;
  const passwordErr =
    props.password ? passwordCheck(props.password) : null;
  const repeatPasswordErr =
    props.password && props.repeatPassword ? repeatPasswordCheck(
        props.password,
        props.repeatPassword) : null;
  if (emailErr || usernameErr || passwordErr || repeatPasswordErr) {
    store.dispatch({
      type: ActionType.CHANGEUSERDATA_FAIL,
      payload: {
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
  api.putUserData(props)
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.CHANGEUSERDATA_SUCCESS,
            payload: {
              user: res.body as PayloadChangeUserData,
              formErrors: {
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
      .catch(() => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: 'error fetch',
          },
        });
      });
};
