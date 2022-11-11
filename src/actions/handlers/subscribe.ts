import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/store';
import {Subscription} from '@actions/types/subscribe';

export const subscribe = (
    authorID: number,
    authorSubscriptionID: number): void => {
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

export const unsubscribe = (
    authorID: number,
    authorSubscriptionID: number): void => {
  api.unsubscribe(authorID, authorSubscriptionID)
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.UNSUBSCRIBE,
            payload: {
              success: true,
              error: undefined,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.UNSUBSCRIBE,
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

/**
 * @param id id пользователя
 */
export const getSubscritions = (id: number) => {
  api.getSubscriptions(id)
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.GETSUBSCRIPTIONS,
            payload: {
              subscriptions: res.body as Subscription[],
              error: undefined,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.GETSUBSCRIPTIONS,
            payload: {
              subscriptions: [],
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
