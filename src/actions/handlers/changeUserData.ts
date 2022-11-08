import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/store';
import {
  ChangeUserDataForm,
  PayloadChangeUserData} from '@actions/types/changeUserData';
import {PayloadUser} from '@actions/types/user';
import {
  emailCheck,
  passwordCheck,
  repeatPasswordCheck,
  usernameCheck} from '@validation/validation';

export default (props: ChangeUserDataForm): void => {
  const emailErr = emailCheck(props.email.value);
  const usernameErr = usernameCheck(props.username.value);
  const passwordErr = passwordCheck(props.password.value);
  const repeatPasswordErr = repeatPasswordCheck(
      props.password.value,
      props.repeatPassword.value);
  if (emailErr || usernameErr || passwordErr || repeatPasswordErr) {
    store.dispatch({
      type: ActionType.CHANGEUSERDATA_FAIL,
      payload: {
        email: emailErr,
        username: usernameErr,
        password: passwordErr,
        repeatPassword: repeatPasswordErr,
      },
    });
    return;
  }
  const user = store.getState().user as PayloadUser;
  api.putUserData({
    id: Number(user.id),
    username: props.username.value,
    email: props.email.value,
    password: props.password.value,
  })
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
