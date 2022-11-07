import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/store';
import {ChangeUserDataForm} from '@actions/types/changeUserData';
import {PayloadUser} from '@actions/types/user';

export default (props: ChangeUserDataForm): void => {
  if (props.password !== props.password) {
    store.dispatch({
      type: ActionType.CHANGEUSERDATA,
      payload: {
        success: false,
        error: 'Пароли не совпадают',
      },
    });
    return;
  }
  const user = store.getState().user as PayloadUser;
  api.putUserData(
      Number(user.id),
      props.username.value,
      props.email.value,
      props.password.value,
  )
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.CHANGEUSERDATA,
            payload: {
              success: true,
              error: undefined,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.CHANGEUSERDATA,
            payload: {
              success: false,
              error: res.body.message as string,
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
