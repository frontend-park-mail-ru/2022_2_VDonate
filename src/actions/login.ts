import {ActionType} from '@actions/types/action';
import {Dispatcher} from '@flux/types/store';
import {ResponseData} from '@api/ajax';
import api from '@app/api';
import {ActionLogIn, LoginForm} from './types/login';
import {ActionNotice} from './types/notice';
import router from '@app/router';

export default (props: LoginForm,
    dispatch: Dispatcher<ActionLogIn | ActionNotice>): void => {
  api.loginUser(props.username.value, props.password.value)
      .then((res: ResponseData) => {
        if (res.ok) {
          dispatch({
            type: ActionType.LOGIN,
            payload: {
              id: res.body.id as number,
            },
          });
          router.go('/feed');
        } else {
          dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: 'error login',
            },
          });
        }
      })
      .catch(() => {
        dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: 'error fetch',
          },
        });
      });
};
