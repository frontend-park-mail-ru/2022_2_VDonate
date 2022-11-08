// import api from '@app/api';
// import {ResponseData} from '@api/ajax';
import {ActionType} from '@actions/types/action';
import store from '@app/store';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import subImg from '@img/2.jpg';
import avatarImage from '@img/1.jpg';

export default (id: number): void => {
  // заглушка на профиль
  const tup = [true, true, false];
  const profileData: PayloadGetProfileData = {
    profile: {
      about: `Меня зовут Марина, мне 17 лет, я учусь
      в 11 классе. Не могу сказать, что я обожаю ходить
      в школу, но учусь я довольно таки не плохо. Мои любимые
      предметы это литература, химия, биология, и физика. С самого
      детства я ходила на разные кружки. Это баскетбол, восточные
       танцы, гимнастика, хип – хоп, волейбол, и плаванье. Но, к
       сожалению, я себя ни в чем не нашла...
      `,
      avatar: avatarImage,
      is_author: tup[id - 1],
      username: 'Кодзима',
    },
    authorSubscriptions: [
      {
        img: subImg,
        price: 1000,
        text: `Участие в розыгрышах<br>
        Доступ к эксклюзивным семплам<br>
        Материалы со стримов <br>
        Запись стримов<br>
        Эксклюзивные посты<br>
        30 минутный разговор<br>
        Что-нибудь еще<br>
        Третье<br>
        Десятое<br>
        Сто двадцать пятое`,
        tier: 1,
        title: 'Элитная подписка',
      },
      {
        img: subImg,
        price: 1000,
        text: `Участие в розыгрышах<br>
        Доступ к эксклюзивным семплам<br>
        Материалы со стримов <br>
        Запись стримов<br>
        Эксклюзивные посты<br>
        30 минутный разговор<br>
        Что-нибудь еще<br>
        Третье<br>
        Десятое<br>
        Сто двадцать пятое`,
        tier: 1,
        title: 'Элитная подписка',
      },
      {
        img: subImg,
        price: 1000,
        text: `Участие в розыгрышах<br>
        Доступ к эксклюзивным семплам<br>
        Материалы со стримов <br>
        Запись стримов<br>
        Эксклюзивные посты<br>
        30 минутный разговор<br>
        Что-нибудь еще<br>
        Третье<br>
        Десятое<br>
        Сто двадцать пятое`,
        tier: 1,
        title: 'Элитная подписка',
      },
      {
        img: subImg,
        price: 1000,
        text: `Участие в розыгрышах<br>
        Доступ к эксклюзивным семплам<br>
        Материалы со стримов <br>
        Запись стримов<br>
        Эксклюзивные посты<br>
        30 минутный разговор<br>
        Что-нибудь еще<br>
        Третье<br>
        Десятое<br>
        Сто двадцать пятое`,
        tier: 1,
        title: 'Элитная подписка',
      },
    ],
    subscriptions: [
      {
        img: subImg,
        price: 1000,
        text: `Участие в розыгрышах<br>
        Доступ к эксклюзивным семплам<br>
        Материалы со стримов <br>
        Запись стримов<br>
        Эксклюзивные посты<br>
        30 минутный разговор<br>
        Что-нибудь еще<br>
        Третье<br>
        Десятое<br>
        Сто двадцать пятое`,
        tier: 1,
        title: 'Элитная подписка',
      },
      {
        img: subImg,
        price: 1000,
        text: `Участие в розыгрышах<br>
        Доступ к эксклюзивным семплам<br>
        Материалы со стримов <br>
        Запись стримов<br>
        Эксклюзивные посты<br>
        30 минутный разговор<br>
        Что-нибудь еще<br>
        Третье<br>
        Десятое<br>
        Сто двадцать пятое`,
        tier: 1,
        title: 'Элитная подписка',
      },
      {
        img: subImg,
        price: 1000,
        text: `Участие в розыгрышах<br>
        Доступ к эксклюзивным семплам<br>
        Материалы со стримов <br>
        Запись стримов<br>
        Эксклюзивные посты<br>
        30 минутный разговор<br>
        Что-нибудь еще<br>
        Третье<br>
        Десятое<br>
        Сто двадцать пятое`,
        tier: 1,
        title: 'Элитная подписка',
      },
      {
        img: subImg,
        price: 1000,
        text: `Участие в розыгрышах<br>
        Доступ к эксклюзивным семплам<br>
        Материалы со стримов <br>
        Запись стримов<br>
        Эксклюзивные посты<br>
        30 минутный разговор<br>
        Что-нибудь еще<br>
        Третье<br>
        Десятое<br>
        Сто двадцать пятое`,
        tier: 1,
        title: 'Элитная подписка',
      },
      {
        img: subImg,
        price: 1000,
        text: `Участие в розыгрышах<br>
        Доступ к эксклюзивным семплам<br>
        Материалы со стримов <br>
        Запись стримов<br>
        Эксклюзивные посты<br>
        30 минутный разговор<br>
        Что-нибудь еще<br>
        Третье<br>
        Десятое<br>
        Сто двадцать пятое`,
        tier: 1,
        title: 'Элитная подписка',
      },
      {
        img: subImg,
        price: 1000,
        text: `Участие в розыгрышах<br>
        Доступ к эксклюзивным семплам<br>
        Материалы со стримов <br>
        Запись стримов<br>
        Эксклюзивные посты<br>
        30 минутный разговор<br>
        Что-нибудь еще<br>
        Третье<br>
        Десятое<br>
        Сто двадцать пятое`,
        tier: 1,
        title: 'Элитная подписка',
      },
      {
        img: subImg,
        price: 1000,
        text: `Участие в розыгрышах<br>
        Доступ к эксклюзивным семплам<br>
        Материалы со стримов <br>
        Запись стримов<br>
        Эксклюзивные посты<br>
        30 минутный разговор<br>
        Что-нибудь еще<br>
        Третье<br>
        Десятое<br>
        Сто двадцать пятое`,
        tier: 1,
        title: 'Элитная подписка',
      },
    ],
    subscribers: [
      {
        about: 'Текст обо мне и много текста',
        avatar: avatarImage,
        is_author: false,
        username: 'Кодзима',
      },
      {
        about: 'Текст обо мне и много текста',
        avatar: avatarImage,
        is_author: false,
        username: 'Кодзима',
      },
      {
        about: 'Текст обо мне и много текста',
        avatar: avatarImage,
        is_author: false,
        username: 'Кодзима',
      },
      {
        about: 'Текст обо мне и много текста',
        avatar: avatarImage,
        is_author: false,
        username: 'Кодзима',
      },
    ],
  };
  // const profileData: PayloadGetProfileData = {
  //   profile: undefined,
  //   authorSubscriptions: undefined,
  //   subscriptions: undefined,
  //   subscribers: undefined,
  // };
  // api.getUser(id)
  //     .then(
  //         (res: ResponseData) => {
  //           if (res.ok) {
  //             profileData.profile =
  //               res.body as PayloadGetProfileData['profile'];
  //           } else {
  //             store.dispatch({
  //               type: ActionType.NOTICE,
  //               payload: {
  //                 message: res.body.message as string,
  //               },
  //             });
  //             return;
  //           }
  //         },
  //     )
  //     .catch(
  //         () => {
  //           store.dispatch({
  //             type: ActionType.NOTICE,
  //             payload: {
  //               message: 'error fetch',
  //             },
  //           });
  //           return;
  //         },
  //     );
  // api.getSubscritions(id)
  //     .then(
  //         (res: ResponseData) => {
  //           if (res.ok) {
  //             profileData.subscriptions =
  //               res.body as PayloadGetProfileData['subscriptions'];
  //           } else {
  //             store.dispatch({
  //               type: ActionType.NOTICE,
  //               payload: {
  //                 message: res.body.message as string,
  //               },
  //             });
  //             return;
  //           }
  //         },
  //     )
  //     .catch(
  //         () => {
  //           store.dispatch({
  //             type: ActionType.NOTICE,
  //             payload: {
  //               message: 'error fetch',
  //             },
  //           });
  //           return;
  //         },
  //     );
  // if (profileData.profile?.is_author) {
  //   api.getSubscribers(id)
  //       .then(
  //           (res: ResponseData) => {
  //             if (res.ok) {
  //               profileData.subscribers =
  //                 res.body as PayloadGetProfileData['subscribers'];
  //             } else {
  //               store.dispatch({
  //                 type: ActionType.NOTICE,
  //                 payload: {
  //                   message: res.body.message as string,
  //                 },
  //               });
  //               return;
  //             }
  //           },
  //       )
  //       .catch(
  //           () => {
  //             store.dispatch({
  //               type: ActionType.NOTICE,
  //               payload: {
  //                 message: 'error fetch',
  //               },
  //             });
  //             return;
  //           },
  //       );
  //   api.getAuthorSubscritions(id)
  //       .then(
  //           (res: ResponseData) => {
  //             if (res.ok) {
  //               profileData.authorSubscriptions =
  //                 res.body as PayloadGetProfileData['authorSubscriptions'];
  //             } else {
  //               store.dispatch({
  //                 type: ActionType.NOTICE,
  //                 payload: {
  //                   message: res.body.message as string,
  //                 },
  //               });
  //               return;
  //             }
  //           },
  //       )
  //       .catch(
  //           () => {
  //             store.dispatch({
  //               type: ActionType.NOTICE,
  //               payload: {
  //                 message: 'error fetch',
  //               },
  //             });
  //             return;
  //           },
  //       );
  // }
  store.dispatch({
    type: ActionType.GETPROFILEDATA,
    payload: {
      profileData: profileData,
      errors: undefined,
    },
  });
};
