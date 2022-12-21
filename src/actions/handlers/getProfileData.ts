import api from '@app/Api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/Store';
import {
  PayloadProfileUser} from '@actions/types/getProfileData';
import {PayloadPost} from '@actions/types/posts';
import {Pages} from '@configs/router';
import {PayloadSubscription} from '@actions/types/subscribe';
import {auth} from './user';


const getAuthorData = async (user: PayloadProfileUser) => {
  const getSubscriptionsRes = await api.getAuthorSubscriptions(user.id);
  const getPostsRes = await api.getAuthorPosts(user.id);
  const authorSubscriptions = getSubscriptionsRes.ok ?
    getSubscriptionsRes.body as PayloadSubscription[] : undefined;

  const posts = getPostsRes.ok ?
    getPostsRes.body as PayloadPost[] : undefined;

  store.dispatch({
    type: ActionType.GET_PROFILEDATA,
    payload: {
      user,
      authorSubscriptions,
      posts,
    },
  });
  switch (getSubscriptionsRes.status) {
    case 400:
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: `Ошибка при создании запроса 
          на сервер при получении карт подписок`,
        },
      });
      break;
    case 401:
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: 'Ошибка авторизации',
        },
      });
      break;
    case 403:
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: 'Ошибка доступа',
        },
      });
      break;
    case 500:
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: 'Ошибка сервера при получении карт подписок',
        },
      });
      break;
    default:
      break;
  }
  switch (getPostsRes.status) {
    case 400:
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: `Ошибка при создании запроса 
          на сервер при получении постов`,
        },
      });
      break;
    case 401:
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: 'Ошибка авторизации',
        },
      });
      break;
    case 403:
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: 'Ошибка доступа',
        },
      });
      break;
    case 500:
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: 'Ошибка сервера при получении постов',
        },
      });
      break;
    default:
      break;
  }
};

const getDonaterData = async (user: PayloadProfileUser) => {
  const getSubscriptionsRes = await api.getSubscriptions(user.id);
  const subscriptions = getSubscriptionsRes.ok ?
    getSubscriptionsRes.body as PayloadSubscription[] :
    undefined;

  store.dispatch({
    type: ActionType.GET_PROFILEDATA,
    payload: {
      user,
      userSubscriptions: subscriptions,
    },
  });
  switch (getSubscriptionsRes.status) {
    case 400:
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: `Ошибка при создании запроса 
          на сервер при получении подписок донатера`,
        },
      });
      break;
    case 401:
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: 'Ошибка авторизации',
        },
      });
      break;
    case 403:
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: 'Ошибка доступа',
        },
      });
      break;
    case 500:
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: 'Ошибка сервера при получении подписок донатера',
        },
      });
      break;
    default:
      break;
  }
};

export default (id: number): void => {
  api.getUser(id)
      .then((res: ResponseData) => {
        if (res.ok) {
          const user: PayloadProfileUser = {
            id: id,
            avatar: res.body.avatar as string,
            isAuthor: res.body.isAuthor as boolean,
            username: res.body.username as string,
            countSubscriptions: res.body.countSubscriptions as number,
          };
          if (user.isAuthor) {
            user.countDonaters = res.body.countSubscribers as number;
            user.about = res.body.about as string;
            user.countPosts = res.body.countPosts as number;
            user.countProfitMounth = res.body.countProfitMounth as number;
            user.countSubscribersMounth =
              res.body.countSubscribersMounth as number;
            return getAuthorData(user);
          } else {
            return getDonaterData(user);
          }
        } else {
          switch (res.status) {
            case 404:
              store.dispatch({
                type: ActionType.ROUTING,
                payload: {
                  type: Pages.NOT_FOUND,
                  options: {},
                },
              });
              break;
            case 401:
              return auth();
            default:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: res.body.message as string,
                },
              });
              break;
          }
          return;
        }
      },
      )
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
        return;
      },
      );
};
