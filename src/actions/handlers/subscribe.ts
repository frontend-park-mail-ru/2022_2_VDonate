import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/store';
import {
  PayloadAuthorSubscription,
  Subscription} from '@actions/types/subscribe';

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
  api.getSubscritions(id)
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

export interface AuthorSubscrptionForm extends HTMLCollection {
  title: HTMLInputElement
  price: HTMLInputElement
  tier: HTMLInputElement
  text: HTMLInputElement
  file: HTMLInputElement
}

export const editAuthorSubscription = (
    subId: number,
    form: AuthorSubscrptionForm) => {
  const subData: {
    id: number,
    price?: number,
    text?: string,
    tier?: number,
    title?: string,
    file?: File,
  } = {
    id: subId,
  };
  if (typeof form.tier.value != 'number' ||
    typeof form.price.value != 'number') {
    return; // TODO норм валидацию допилить
  }
  if (form.price.value != '') {
    subData.price = form.price.value;
  }
  if (form.text.value != '') {
    subData.text = form.text.value;
  }
  if (form.tier.value != '') {
    subData.tier = form.tier.value;
  }
  if (form.title.value != '') {
    subData.title = form.title.value;
  }
  if (form.file.files) {
    subData.file = form.file.files[0];
  }
  api.editAuthorSubscription(subData)
      .then((res: ResponseData) => {
        store.dispatch({
          type: ActionType.EDITAUTHORSUBSRIPTION,
          payload: res.body as PayloadAuthorSubscription,
        });
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

export const createAuthorSubscription = (form: AuthorSubscrptionForm) => {
  if (
    form.price.value == '' ||
    form.text.value == '' ||
    form.tier.value == '' ||
    form.title.value == '' ||
    !form.file.files) {
    // TODO норм валидация
    return;
  }
  api.createAuthorSubscription({
    price: Number(form.price.value),
    text: form.text.value,
    tier: Number(form.tier.value),
    title: form.title.value,
    file: form.file.files[0],
  })
      .then((res: ResponseData) => {
        store.dispatch({
          type: ActionType.EDITAUTHORSUBSRIPTION,
          payload: res.body as PayloadAuthorSubscription,
        });
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
