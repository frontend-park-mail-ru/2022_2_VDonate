import {Dispatcher} from '@flux/types/store';
import router from '@app/router';
import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import {ActionAuth} from './types/auth';
import {ActionNotice} from './types/notice';

export default (dispatch: Dispatcher<ActionAuth | ActionNotice>): void => {
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
