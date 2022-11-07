import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import router from '@app/router';
import store from '@app/store';
import {PayloadAuth} from '@actions/types/auth';

export default (): void => {
  api.authUser()
      .then(
          (res: ResponseData) => {
            if (res.ok) {
              store.dispatch({
                type: ActionType.AUTH,
                payload: {
                  auth: res.body as PayloadAuth,
                  location: {
                    type: router.go(location.pathname + location.search),
                  },
                },
              });
            } else {
              store.dispatch({
                type: ActionType.ROUTING,
                payload: {
                  type: router.go('/login'),
                },
              });
            }
          },
      )
      .catch(
          () => {
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: 'error fetch',
              },
            });
          },
      );
};
