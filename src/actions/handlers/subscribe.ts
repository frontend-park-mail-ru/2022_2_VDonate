import api from '@app/api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/store';
import {
  PayloadAuthorSubscription,
  Subscription} from '@actions/types/subscribe';
import {FormErrorType} from '@actions/types/formError';
import {
  priceCheck,
  textCheck,
  tierCheck,
  titleCheck} from '@validation/validation';
import {PayloadNotice} from '@actions/types/notice';

export const subscribe = (
    authorID: number,
    authorSubscriptionID: number): void => {
  api.subscribe(authorID, authorSubscriptionID)
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.SUBSCRIBE,
            payload: {
              authorSubscriptionID,
              error: undefined,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.SUBSCRIBE,
            payload: {
              error: 'Ошибка при попытке подписаться',
            },
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
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
              authorSubscriptionID,
              error: undefined,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.UNSUBSCRIBE,
            payload: {
              error: 'Ошибка при попытке отписаться',
            },
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
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
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
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
  const priceErr = priceCheck(form.price.value);
  const textErr = textCheck(form.text.value);
  const tierErr = tierCheck(form.tier.value);
  const titleErr = titleCheck(form.title.value);
  if (priceErr || textErr || tierErr || titleErr) {
    store.dispatch({
      type: ActionType.EDITAUTHORSUBSRIPTION,
      payload: {
        formErrors: {
          type: FormErrorType.AUTHOR_SUBSCRIPTION,
          price: priceErr,
          text: textErr,
          tier: tierErr,
          title: titleErr,
          file: null,
        },
      },
    });
    return;
  }
  const subData: {
    id: number,
    price: number,
    text: string,
    tier: number,
    title: string,
    file?: File,
  } = {
    id: subId,
    price: Number(form.price.value),
    text: form.text.value,
    tier: Number(form.tier.value),
    title: form.title.value,
  };
  if (form.file.files) {
    subData.file = form.file.files[0];
  }

  api.editAuthorSubscription(subData)
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.EDITAUTHORSUBSRIPTION,
            payload: {
              subscription: {
                imgPath:
                  res.body.imgPath as PayloadAuthorSubscription['imgPath'],
                subscriptionId:
      res.body.subscriptionID as PayloadAuthorSubscription['subscriptionId'],
                price: Number(form.price.value),
                text: form.text.value,
                tier: Number(form.tier.value),
                title: form.title.value,
              },
              formErrors: {
                type: FormErrorType.AUTHOR_SUBSCRIPTION,
                price: null,
                text: null,
                tier: null,
                title: null,
                file: null,
              },
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: res.body as PayloadNotice,
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
      });
};

export const createAuthorSubscription = (form: AuthorSubscrptionForm) => {
  const priceErr = priceCheck(form.price.value);
  const textErr = textCheck(form.text.value);
  const tierErr = tierCheck(form.tier.value);
  const titleErr = titleCheck(form.title.value);
  if (priceErr || textErr || tierErr || titleErr) {
    store.dispatch({
      type: ActionType.EDITAUTHORSUBSRIPTION,
      payload: {
        formErrors: {
          type: FormErrorType.AUTHOR_SUBSCRIPTION,
          price: priceErr,
          text: textErr,
          tier: tierErr,
          title: titleErr,
          file: null,
        },
      },
    });
    return;
  }
  api.createAuthorSubscription({
    price: Number(form.price.value),
    text: form.text.value,
    tier: Number(form.tier.value),
    title: form.title.value,
    file: form.file.files ? form.file.files[0] : undefined,
  })
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.EDITAUTHORSUBSRIPTION,
            payload: {
              subscription: {
                imgPath:
                  res.body.imgPath as PayloadAuthorSubscription['imgPath'],
                subscriptionId:
      res.body.subscriptionID as PayloadAuthorSubscription['subscriptionId'],
                price: Number(form.price.value),
                text: form.text.value,
                tier: Number(form.tier.value),
                title: form.title.value,
              },
              formErrors: {
                type: FormErrorType.AUTHOR_SUBSCRIPTION,
                price: null,
                text: null,
                tier: null,
                title: null,
                file: null,
              },
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: res.body as PayloadNotice,
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
      });
};
