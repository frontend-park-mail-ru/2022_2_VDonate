import {ActionType} from '@actions/types/action';
import {PayloadBackNotice} from '@actions/types/notice';
import store from '@app/Store';

interface LikeBackNoticeModel {
  name: 'like'
  data: {
    username: number
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

enum PaymentStatus {
  SUCCESS = 'PAID',
  FAIL = 'REJECTED',
  TIMEOUT = 'EXPIRED',
}

interface PaymentBackNoticeModel {
  name: 'payment'
  data: {
    user_id: number
    author_id: number
    sub_id: number
    status: PaymentStatus
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
      let type: 'info' | 'error';
      switch (notice.name) {
        case 'like':
          message = `Пользователь ${notice.data.username} оценил ваш пост.`;
          type = 'info';
          break;
        case 'post':
          message = `Пользователь ${notice.data.author_name} опубликовал пост.`;
          type = 'info';
          break;
        case 'subscriber':
          message =
            `Пользователь ${notice.data.subscriberName} подписался на вас.`;
          type = 'info';
          break;
        case 'payment':
          switch (notice.data.status) {
            case PaymentStatus.SUCCESS:
              message = 'Оплата прошла успешно.';
              type = 'info';
              break;
            case PaymentStatus.FAIL:
              message = 'Оплата не выполнена. Повторите попытку.';
              type = 'error';
              break;
            case PaymentStatus.TIMEOUT:
              message = 'Время ожидания оплаты вышло. Повторите попытку.';
              type = 'error';
              break;
            default:
              message = 'Error: неизвестный тип статуса оплаты';
              type = 'error';
              break;
          }
          break;
        default:
          message = 'Error: неизвестный тип уведомления';
          type = 'error';
          break;
      }
      payload.push({
        message,
        timestamp: new Date(notice.time),
        type,
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
