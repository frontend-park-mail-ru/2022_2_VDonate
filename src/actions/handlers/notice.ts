import {ActionType} from '@actions/types/action';
import {PayloadBackNotice} from '@actions/types/notice';
import store from '@app/Store';

interface LikeBackNoticeModel {
  name: 'like'
  data: {
    user_id: number
    post_id: number
  }
  time: string
}

interface PostBackNoticeModel {
  name: 'post'
  data: {
    user_id: number
    author_id: number
    author_name: number
  }
  time: string
}

interface SubscriberBackNoticeModel {
  name: 'subscriber'
  data: {
    user_id: number
    subscriber_id: number
    subscriberName: string
  }
  time: string
}

interface PaymentBackNoticeModel {
  name: 'payment'
  data: {
    user_id: number
    author_id: number
    sub_id: number
    status: string // FIXME: unknown
  }
  time: string
}

type BackNoticeModel =
  | LikeBackNoticeModel
  | PostBackNoticeModel
  | SubscriberBackNoticeModel
  | PaymentBackNoticeModel;

export const notice = (message: string | string[], type?: 'error' | 'info') => {
  store.dispatch({
    type: ActionType.NOTICE,
    payload: {
      message,
      type,
    },
  });
};

export const addBackNotice =
  (data: string) => {
    const notices = JSON.parse(data) as BackNoticeModel[];
    const payload: PayloadBackNotice[] = [];
    notices.forEach((notice) => {
      let message = '';
      switch (notice.name) {
        case 'like':
          message = 'Пользователь оценил ваш пост';
          break;
        case 'post':
          message = `Пользователь ${notice.data.author_name} опубликовал пост`;
          break;
        case 'subscriber':
          message =
          `Пользователь ${notice.data.subscriberName} подписался на вас`;
          break;
        case 'payment':
          message =
          `Оплатата прошла со статусом ${notice.data.status}`;
          break;
        default:
          break;
      }
      payload.push({
        message,
        timestamp: new Date(notice.time),
        type: 'info',
      });
    });

    store.dispatch({
      type: ActionType.ADD_BACK_NOTICE,
      payload,
    });
  };

export const clearAllBackNotice = () => {
  store.dispatch({
    type: ActionType.CLEAR_BACK_NOTICE,
    payload: {},
  });
};
