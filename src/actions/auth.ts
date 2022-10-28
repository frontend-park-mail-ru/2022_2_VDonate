import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from './types/action';
import {dispatch} from './types/auth';
import router from '@app/router';

export default (): void => {
  api.authUser()
      .then(
          (res: ResponseData) => {
            if (res.ok) {
              dispatch({
                type: ActionType.AUTH,
                payload: {
                  id: res.body.id as number,
                },
              });
              router.go(location.pathname + location.search);
            } else {
              router.go('/login');
            }
          },
      )
      .catch(
          () => {
            dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: 'error fetch',
              },
            });
            router.go('/login');
          },
      );
};
