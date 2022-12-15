import api from '@app/Api';
import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/Store';
import {
  PayloadSubscription} from '@actions/types/subscribe';
import {FormErrorType} from '@actions/types/formError';
import {
  priceCheck,
  textCheck,
  tierCheck,
  titleCheck} from '@validation/validation';
import {PayloadPost} from '@actions/types/posts';


const loadNewPosts =
  (authorID: number, dispatch: (posts: PayloadPost[]) => void) =>
    api.getAuthorPosts(authorID)
        .then((res) => {
          if (res.ok) {
            const posts = res.body as PayloadPost[];
            dispatch(posts);
          } else {
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message:
                  'Ошибка при попытке получить посты после смены подписки',
              },
            });
          }
        })
        .catch((err) => {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: err as Error,
            },
          });
        });


const subscribeOnly = (
    authorID: number,
    authorSubscriptionID: number,
    dispatch: (posts: PayloadPost[]) => void,
) => api.subscribe(authorID, authorSubscriptionID)
    .then((res: ResponseData) => {
      if (res.ok) {
        return loadNewPosts(authorID, dispatch);
      } else {
        switch (res.status) {
          case 400:
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: 'Error: 400 - subscribeOnly handler',
              },
            });
            break;
          case 500:
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: 'Упс! Подписаться не удалось. Повторите попытку.',
              },
            });
            break;
          default:
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: 'Error: subscribeOnly handler',
              },
            });
            break;
        }
      }
    })
    .catch((err) => {
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: err as Error,
        },
      });
    });

const switchSubscription = (
    authorID: number,
    oldSubscriptionID: number,
    newSubscriptionID: number,
) => {
  api.unsubscribe(authorID, oldSubscriptionID)
      .then((res: ResponseData) => {
        if (res.ok) {
          return subscribeOnly(
              authorID,
              newSubscriptionID,
              (posts) => {
                store.dispatch({
                  type: ActionType.SWITCH_SUBSCRIPTION,
                  payload: {
                    oldSubscriptionID,
                    newSubscriptionID,
                    posts,
                  },
                });
              },
          );
        } else {
          switch (res.status) {
            case 400:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: 'Error: 400 - switchSubscription handler',
                },
              });
              break;
            case 500:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message:
                    'Упс! Сменить подписку не удалось. Повторите попытку.',
                },
              });
              break;
            default:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: 'Error: switchSubscription handler',
                },
              });
              break;
          }
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
      });
};

export const subscribe = (
    authorID: number,
    authorSubscriptionID: number): void => {
  const userSubscriptions = store.getState()
      .userSubscriptions as Map<number, PayloadSubscription>;
  const userSubscriptionsArr = [...userSubscriptions.entries()];
  const oldSubscriptionIdx = userSubscriptionsArr
      .findIndex(([, sub]) => sub.authorID === authorID);

  if (oldSubscriptionIdx !== -1) {
    switchSubscription(
        authorID,
        userSubscriptionsArr[oldSubscriptionIdx][0],
        authorSubscriptionID,
    );
  } else {
    void subscribeOnly(authorID, authorSubscriptionID, (posts) => {
      store.dispatch({
        type: ActionType.SUBSCRIBE,
        payload: {
          authorSubscriptionID,
          posts,
        },
      });
    });
  }
};

export const unsubscribe = (
    authorID: number,
    authorSubscriptionID: number): void => {
  api.unsubscribe(authorID, authorSubscriptionID)
      .then((res: ResponseData) => {
        if (res.ok) {
          return loadNewPosts(authorID, (posts: PayloadPost[]) => {
            store.dispatch({
              type: ActionType.UNSUBSCRIBE,
              payload: {
                authorSubscriptionID,
                posts,
              },
            });
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: 'Ошибка при попытке отписаться',
            },
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
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
            payload: res.body as PayloadSubscription[],
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: 'Ошибка при получении подписок',
            },
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
      });
};

export interface AuthorSubscrptionForm extends HTMLCollection {
  title: HTMLInputElement
  price: HTMLInputElement
  tier: HTMLInputElement
  text: HTMLInputElement
  file?: HTMLInputElement
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
  if (form.file?.files && form.file.files.length > 0) {
    subData.file = form.file.files[0];
  }

  api.editAuthorSubscription(subData)
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.EDITAUTHORSUBSRIPTION,
            payload: {
              subscription: {
                authorID: res.body.authorID as number,
                authorAvatar: res.body.authorAvatar as string,
                authorName: res.body.authorName as string,
                id: res.body.subscriptionID as number,
                img: res.body.imgPath as string,
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
            payload: {
              message: 'Ошибка сервера при изменении подписки',
            },
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
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
      type: ActionType.CREATEAUTHORSUBSRIPTION,
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
    file: form.file?.files ? form.file.files[0] : undefined,
  })
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.CREATEAUTHORSUBSRIPTION,
            payload: {
              subscription: {
                authorID: res.body.authorID as number,
                authorAvatar: res.body.authorAvatar as string,
                authorName: res.body.authorName as string,
                id: res.body.subscriptionID as number,
                img: res.body.imgPath as string,
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
            payload: {
              message: ' Ощибка при создании подписки',
            },
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
      });
};

export const deleteAuthorSubscription = (id: number) => {
  api.deleteAuthorSubscription(id)
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.DELETEAUTHORSUBSCRIPTION,
            payload: {
              id,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: 'Ошибка сервера при удалении подписки',
            },
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
      });
};
