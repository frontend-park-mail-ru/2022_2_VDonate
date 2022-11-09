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
    user: PayloadProfileUser) => {
  api.getAuthorSubscritions(id)
      .then((res: ResponseData) => {
        if (res.status == 200) {
          const authorSubscriptions = res.body as PayloadAuthorSubscription[];
          store.dispatch({
            type: ActionType.GETPROFILEDATA,
            payload: {
              user: user,
              subscriptions: 'not needed for Author',
              authorSubscriptions: authorSubscriptions,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.GETPROFILEDATA,
            payload: {
              user: user,
              subscriptions: 'not needed for Author',
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
            subscriptions: 'not needed for Author',
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
          store.dispatch({
            type: ActionType.GETPROFILEDATA,
            payload: {
              user: user,
              subscriptions: subscriptions,
              authorSubscriptions: 'not needed for Donater',
            },
          });
        } else {
          store.dispatch({
            type: ActionType.GETPROFILEDATA,
            payload: {
              user: user,
              subscriptions: res.body.message as string,
              authorSubscriptions: 'not needed for Donater',
            },
          });
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
  // заглушка на профиль
  // {
  //   const profileData: PayloadGetProfileData = {
  //     user: {
  //       avatar: '',
  //       isAuthor: true,
  //       username: 'Kodzima',
  //       countSubscriptions: 5,
  //       about: `Меня зовут Марина, мне 17 лет, я учусь
  //       в 11 классе. Не могу сказать, что я обожаю ходить
  //       в школу, но учусь я довольно таки не плохо. Мои любимые
  //       предметы это литература, химия, биология, и физика. С самого
  //       детства я ходила на разные кружки. Это баскетбол, восточные
  //       танцы, гимнастика, хип – хоп, волейбол, и плаванье. Но, к
  //       сожалению, я себя ни в чем не нашла...`,
  //       countSubscribers: 10,
  //     },
  //     authorSubscriptions: [
  //       {
  //         author: {
  //           id: 1,
  //         },
  //         id: 1,
  //         img: '',
  //         price: 1000,
  //         text: `Участие в розыгрышах<br>
  //         Доступ к эксклюзивным семплам<br>
  //         Материалы со стримов <br>
  //         Запись стримов<br>
  //         Эксклюзивные посты<br>
  //         30 минутный разговор<br>
  //         Что-нибудь еще<br>
  //         Третье<br>
  //         Десятое<br>
  //         Сто двадцать пятое`,
  //         tier: 1,
  //         title: 'Элитная подписка',
  //       },
  //     ],
  //     subscriptions: [
  //       {
  //         author: {
  //           id: 1,
  //           avatar: '',
  //           username: 'Кодзима',
  //         },
  //         tier: 1,
  //       },
  //     ],
  //   };
  //   store.dispatch({
  //     type: ActionType.GETPROFILEDATA,
  //     payload: profileData,
  //   });
  //   return;
  // }
  api.getUser(id)
      .then(
          (res: ResponseData) => {
            if (res.ok) {
              const user = res.body as PayloadProfileUser;
              if (user.isAuthor) {
                return getAuthorSubscriptions(id, user);
              } else {
                return getSubscriptions(id, user);
              }
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
