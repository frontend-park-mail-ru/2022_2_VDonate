import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/store';
import {
  PayloadAuthorSubscription,
  PayloadProfileSubscription,
  PayloadProfileUser} from '@actions/types/getProfileData';

const getAuthorSubscriptions = (
    id: number,
    user: PayloadProfileUser,
    subscriptions: PayloadProfileSubscription[] | string) => {
  api.getAuthorSubscritions(id)
      .then((res: ResponseData) => {
        if (res.status == 200) {
          const authorSubscriptions = res.body as PayloadAuthorSubscription[];
          store.dispatch({
            type: ActionType.GETPROFILEDATA,
            payload: {
              user: user,
              subscriptions: subscriptions,
              authorSubscriptions: authorSubscriptions,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.GETPROFILEDATA,
            payload: {
              user: user,
              subscriptions: subscriptions,
              authorSubscriptions: res.body.message as string,
            },
          });
          return;
        }
      })
      .catch(() => {
        store.dispatch({
          type: ActionType.GETPROFILEDATA,
          payload: {
            user: user,
            subscriptions: subscriptions,
            authorSubscriptions: 'Error fetch',
          },
        });
        return;
      });
};

const getSubscriptions = (id: number, user: PayloadProfileUser) => {
  api.getSubscritions(id)
      .then((res: ResponseData) => {
        if (res.ok) {
          const subscriptions = res.body as PayloadProfileSubscription[];
          if (user.isAuthor) {
            return getAuthorSubscriptions(id, user, subscriptions);
          }
          // TODO dispatch
        } else {
          return getAuthorSubscriptions(id, user, res.body.message as string);
        }
      },
      )
      .catch(() => {
        store.dispatch({
          type: ActionType.GETPROFILEDATA,
          payload: {
            user: user,
            subscriptions: 'Error fetch',
            authorSubscriptions: 'Error',
          },
        });
      },
      );
};

export default (id: number): void => {
  api.getUser(id)
      .then(
          (res: ResponseData) => {
            if (res.ok) {
              const user = res.body as PayloadProfileUser;
              return getSubscriptions(id, user);
            } else {
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: res.body.message as string,
                },
              });
              return;
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
            return;
          },
      );
};
