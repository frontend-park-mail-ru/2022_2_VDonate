import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/store';

export default (authorID: number, authorSubscriptionID: number): void => {
  api.subscribe(authorID, authorSubscriptionID)
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.SUBSCRIBE,
            payload: {
              success: true,
              error: undefined,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.SUBSCRIBE,
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
