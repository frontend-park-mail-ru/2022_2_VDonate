import router from '@app/router';
import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/store';
import {ActionAuth} from './types/auth';
import {ActionNotice} from './types/notice';

const dispatch = (action: ActionAuth | ActionNotice) => {
  store.dispatch(action);
};

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
              router(location.pathname + location.search);
            } else {
              router('/login');
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
            router('/login');
          },
      );
};
