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
  titleCheck} from '@validation/validation';
import {PayloadPost} from '@actions/types/posts';
import {
  PayloadGetProfileData} from '@actions/types/getProfileData';
import {auth} from './user';

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
                  [
                    'Ошибка при попытке получить посты после смены подписки',
                    `Error: ${res.status} loadNewPosts`,
                  ],
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


// const subscribeOnly = (
//     authorID: number,
//     authorSubscriptionID: number,
//     dispatch: (posts: PayloadPost[]) => void,
// ) => api.subscribe(authorID, authorSubscriptionID)
//     .then((res: ResponseData) => {
//       if (res.ok) {
//         window.open(res.body.payUrl as string, '_blank');
//         // TODO сделать в отдельной логике через уведомления обновление поста
//         return loadNewPosts(authorID, dispatch);
//       } else {
//         switch (res.status) {
//           case 400:
//             store.dispatch({
//               type: ActionType.NOTICE,
//               payload: {
//                 message: 'Error: 400 - subscribeOnly',
//               },
//             });
//             break;
//           case 500:
//             store.dispatch({
//               type: ActionType.NOTICE,
//               payload: {
//                 message:
//                   'Упс! Подписаться не удалось. Повторите попытку позже.',
//               },
//             });
//             break;
//           default:
//             store.dispatch({
//               type: ActionType.NOTICE,
//               payload: {
//                 message: 'Error: subscribeOnly',
//               },
//             });
//             break;
//         }
//       }
//     })
//     .catch((err) => {
//       store.dispatch({
//         type: ActionType.NOTICE,
//         payload: {
//           message: err as Error,
//         },
//       });
//     });

// const switchSubscription = (
//     authorID: number,
//     oldSubscriptionID: number,
//     newSubscriptionID: number,
// ) => {
//   api.unsubscribe(authorID, oldSubscriptionID)
//       .then((res: ResponseData) => {
//         if (res.ok) {
//           return subscribeOnly(
//               authorID,
//               newSubscriptionID,
//               (posts) => {
//                 store.dispatch({
//                   type: ActionType.SWITCH_SUBSCRIPTION,
//                   payload: {
//                     oldSubscriptionID,
//                     newSubscriptionID,
//                     posts,
//                   },
//                 });
//               },
//           );
//         } else {
//           switch (res.status) {
//             case 400:
//               store.dispatch({
//                 type: ActionType.NOTICE,
//                 payload: {
//                   message: 'Error: 400 - switchSubscription',
//                 },
//               });
//               break;
//             case 500:
//               store.dispatch({
//                 type: ActionType.NOTICE,
//                 payload: {
//                   message:
//              'Упс! Сменить подписку не удалось. Повторите попытку позже.',
//                 },
//               });
//               break;
//             default:
//               store.dispatch({
//                 type: ActionType.NOTICE,
//                 payload: {
//                   message: 'Error: switchSubscription handler',
//                 },
//               });
//               break;
//           }
//         }
//       })
//       .catch((err) => {
//         store.dispatch({
//           type: ActionType.NOTICE,
//           payload: {
//             message: err as Error,
//           },
//         });
//       });
// };

export const subscribe = (
    authorID: number,
    authorSubscriptionID: number): void => {
  api.subscribe(authorID, authorSubscriptionID)
      .then((res: ResponseData) => {
        if (res.ok) {
          window.location.href = res.body.payUrl as string;
          // window.open(res.body.payUrl as string, '_blank');
          // TODO сделать в отдельной логике через уведомления обновление поста
        } else {
          switch (res.status) {
            case 400:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: 'Error: 400 - subscribeOnly',
                },
              });
              break;
            case 500:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message:
                    'Упс! Подписаться не удалось. Повторите попытку позже.',
                },
              });
              break;
            default:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: 'Error: subscribeOnly',
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

  // const userSubscriptions = store.getState()
  //     .userSubscriptions as Map<number, PayloadSubscription>;
  // const userSubscriptionsArr = [...userSubscriptions.entries()];
  // const oldSubscriptionIdx = userSubscriptionsArr
  //     .findIndex(([, sub]) => sub.authorID === authorID);

  // if (oldSubscriptionIdx !== -1) {
  //   switchSubscription(
  //       authorID,
  //       userSubscriptionsArr[oldSubscriptionIdx][0],
  //       authorSubscriptionID,
  //   );
  // } else {
  //   void subscribeOnly(authorID, authorSubscriptionID, (posts) => {
  //     store.dispatch({
  //       type: ActionType.SUBSCRIBE,
  //       payload: {
  //         authorSubscriptionID,
  //         posts,
  //       },
  //     });
  //   });
  // }
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
export const getSubscriptions = (id: number) => {
  api.getSubscriptions(id)
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.GET_SUBSCRIPTIONS,
            payload: res.body as PayloadSubscription[],
          });
        } else {
          switch (res.status) {
            case 401:
              auth();
              break;
            case 403:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message:
                'У вас нет доступа к получениям подписок данного пользователя.',
                },
              });
              break;
            default:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: `Error: ${res.status} - getSubscriptions`,
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

export interface AuthorSubscriptionForm extends HTMLCollection {
  title: HTMLInputElement
  price: HTMLInputElement
  text: HTMLInputElement
  file?: HTMLInputElement
}

const updateSubscriptions =
  async (
      copy: PayloadSubscription[],
      src: PayloadSubscription[],
      priceChanged: boolean,
  ) => {
    if (!priceChanged) return;
    for (const sub of src) {
      const newTier = copy.findIndex((subCopy) => subCopy.id === sub.id) + 1;
      if (newTier && sub.tier !== newTier) {
        const subData = {
          id: sub.id,
          tier: newTier,
        };
        const res = await api.editAuthorSubscription(subData);
        if (!res.ok) {
          throw new Error(`Error: ${res.status} - updateSubscriptions`);
        }
      }
    }
  };

export const editAuthorSubscription = (
    subID: number,
    form: AuthorSubscriptionForm) => {
  let priceErr = priceCheck(form.price.value);
  const textErr = textCheck(form.text.value);
  const titleErr = titleCheck(form.title.value);

  const authorSubscriptions =
    (store.getState().profile as PayloadGetProfileData).authorSubscriptions;
  if (authorSubscriptions === undefined) {
    store.dispatch({
      type: ActionType.NOTICE,
      payload: {
        message:
          'Error: editAuthorSubscription вызвался для профиля без подписок',
      },
    });
    return;
  }
  const copyAuthorSubscriptions =
    JSON.parse(JSON.stringify(authorSubscriptions)) as PayloadSubscription[];

  if (priceErr === null) {
    priceErr = copyAuthorSubscriptions.find((sub) => {
      if (subID === sub.id) return false;
      return sub.price === Number(form.price.value);
    }) ? 'Подписка с такой ценой уже создана.' : null;
  }

  if (priceErr || textErr || titleErr) {
    store.dispatch({
      type: ActionType.EDIT_AUTHOR_SUBSCRIPTION,
      payload: {
        formErrors: {
          type: FormErrorType.AUTHOR_SUBSCRIPTION,
          price: priceErr,
          text: textErr,
          title: titleErr,
          file: null,
        },
      },
    });
    return;
  }
  const subData: PayloadSubscription & {file?: File} = {
    id: subID,
    price: Number(form.price.value),
    text: form.text.value,
    tier: -1,
    title: form.title.value,
    authorAvatar: '',
    authorID: -1,
    authorName: '',
    img: '',
  };
  if (form.file?.files && form.file.files.length > 0) {
    subData.file = form.file.files[0];
  }

  const oldSub =
    copyAuthorSubscriptions.find((sub) => sub.id === subID);
  let tier = oldSub?.tier ?? 0;
  const priceChanged =
    oldSub && oldSub.price !== Number(form.price.value);
  if (priceChanged) {
    oldSub.price = Number(form.price.value);
    copyAuthorSubscriptions.sort((a, b) => a.price - b.price);
    tier = copyAuthorSubscriptions.findIndex((sub) => sub.id === subID) + 1;
  }

  if (!tier) {
    store.dispatch({
      type: ActionType.NOTICE,
      payload: {
        message: 'Error: подписка потеряна - editAuthorSubscription',
      },
    });
    return;
  }
  subData.tier = tier;
  updateSubscriptions(
      copyAuthorSubscriptions,
      authorSubscriptions,
      Boolean(priceChanged),
  )
      .then(() => {
        return api.editAuthorSubscription({
          id: subData.id,
          price: subData.price,
          text: subData.text,
          tier: subData.tier,
          title: subData.title,
          file: subData.file,
        });
      })
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.EDIT_AUTHOR_SUBSCRIPTION,
            payload: {
              subscription: {
                authorID: res.body.authorID as number,
                authorAvatar: res.body.authorAvatar as string,
                authorName: res.body.authorName as string,
                id: res.body.subscriptionID as number,
                img: res.body.imgPath as string,
                price: Number(form.price.value),
                text: form.text.value,
                tier: tier,
                title: form.title.value,
              },
              formErrors: {
                type: FormErrorType.AUTHOR_SUBSCRIPTION,
                price: null,
                text: null,
                title: null,
                file: null,
              },
            },
          });
        } else {
          switch (res.status) {
            case 400:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: 'Error: 400 - editAuthorSubscription',
                },
              });
              break;
            case 401:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: 'Error: 401 - editAuthorSubscription',
                },
              });
              break;
            case 403:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: 'Error: 403 - editAuthorSubscription',
                },
              });
              break;
            case 500:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: 'Error: 500 - editAuthorSubscription',
                },
              });
              break;
            default:
              store.dispatch({
                type: ActionType.NOTICE,
                payload: {
                  message: 'Error: editAuthorSubscription',
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

export const createAuthorSubscription = (form: AuthorSubscriptionForm) => {
  let priceErr = priceCheck(form.price.value);
  const textErr = textCheck(form.text.value);
  const titleErr = titleCheck(form.title.value);

  const authorSubscriptions =
    (store.getState().profile as PayloadGetProfileData).authorSubscriptions;
  if (authorSubscriptions === undefined) {
    store.dispatch({
      type: ActionType.NOTICE,
      payload: {
        message:
          'Error: createAuthorSubscription вызвался для профиля без подписок',
      },
    });
    return;
  }
  const copyAuthorSubscriptions =
    JSON.parse(JSON.stringify(authorSubscriptions)) as PayloadSubscription[];

  if (priceErr === null) {
    priceErr = copyAuthorSubscriptions.find((sub) => {
      return sub.price === Number(form.price.value);
    }) ? 'Подписка с такой ценой уже создана.' : null;
  }

  if (priceErr || textErr || titleErr) {
    store.dispatch({
      type: ActionType.EDIT_AUTHOR_SUBSCRIPTION,
      payload: {
        formErrors: {
          type: FormErrorType.AUTHOR_SUBSCRIPTION,
          price: priceErr,
          text: textErr,
          title: titleErr,
          file: null,
        },
      },
    });
    return;
  }

  const subData: PayloadSubscription & {file?: File} = {
    id: -1,
    price: Number(form.price.value),
    text: form.text.value,
    tier: -1,
    title: form.title.value,
    authorAvatar: '',
    authorID: -1,
    authorName: '',
    img: '',
  };
  if (form.file?.files && form.file.files.length > 0) {
    subData.file = form.file.files[0];
  }

  copyAuthorSubscriptions.push(subData);
  copyAuthorSubscriptions.sort((a, b) => a.price - b.price);
  const tier = copyAuthorSubscriptions.findIndex((sub) => sub.id === -1) + 1;
  if (!tier) {
    store.dispatch({
      type: ActionType.NOTICE,
      payload: {
        message: 'Error: подписка потеряна - createAuthorSubscription',
      },
    });
    return;
  }
  subData.tier = tier;

  updateSubscriptions(copyAuthorSubscriptions, authorSubscriptions, true)
      .then(() => {
        return api.createAuthorSubscription({
          price: subData.price,
          text: subData.text,
          tier: subData.tier,
          title: subData.title,
          file: subData.file,
        });
      })
      .then((res: ResponseData) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.CREATE_AUTHOR_SUBSCRIPTION,
            payload: {
              subscription: {
                authorID: res.body.authorID as number,
                authorAvatar: res.body.authorAvatar as string,
                authorName: res.body.authorName as string,
                id: res.body.subscriptionID as number,
                img: res.body.imgPath as string,
                price: Number(form.price.value),
                text: form.text.value,
                tier: tier,
                title: form.title.value,
              },
              formErrors: {
                type: FormErrorType.AUTHOR_SUBSCRIPTION,
                price: null,
                text: null,
                // tier: null,
                title: null,
                file: null,
              },
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: 'Ошибка при создании подписки',
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
          const authorSubscriptions =
    (store.getState().profile as PayloadGetProfileData).authorSubscriptions;
          if (authorSubscriptions === undefined) {
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message:
          'Error: createAuthorSubscription вызвался для профиля без подписок',
              },
            });
            return;
          }

          let copyAuthorSubscriptions =
            JSON.parse(JSON
                .stringify(authorSubscriptions)) as PayloadSubscription[];

          if (copyAuthorSubscriptions.length == 1 &&
          copyAuthorSubscriptions[0].id == id) {
            copyAuthorSubscriptions = [];
          } else {
            const idx = copyAuthorSubscriptions.findIndex(
                (sub) => sub.id == id,
            );
            if (idx > -1) {
              copyAuthorSubscriptions.splice(idx, 1);
            }
          }

          return updateSubscriptions(
              copyAuthorSubscriptions,
              authorSubscriptions,
              true,
          )
              .then(() => {
                store.dispatch({
                  type: ActionType.DELETE_AUTHOR_SUBSCRIPTION,
                  payload: {
                    id,
                  },
                });
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
