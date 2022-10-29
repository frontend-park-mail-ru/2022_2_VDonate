import {ActionType} from '@actions/types/action';
import {ResponseData} from '@api/ajax';
import api from '@app/api';
import {LoginForm} from '@actions/types/login';
import router from '@app/router';
import store from '@app/store';

export default (props: LoginForm): void => {
  api.loginUser(props.username.value, props.password.value)
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.LOGIN,
            payload: {
              login: {
                id: res.body.id as number,
              },
              location: {
                type: router.go('/feed'),
              },
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: 'error login',
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
