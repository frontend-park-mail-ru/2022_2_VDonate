// import store from '@app/store';
// import {IView} from '@flux/types/view';
// import {IObserver} from '@flux/types/observer';
// import {ProfileModel} from '@views/pages/profile/profileModel/profileModel';
// import {PayloadUser} from '@actions/types/user';
// import getProfile from '@actions/handlers/getProfileData';
// import {PayloadGetProfileData} from '@actions/types/getProfileData';
// import {Subscription} from '@actions/types/subscribe';
// FIXME Доделать
// /** Реализация интерфейса *IView* для страницы профиля */
// export default class ProfilePage implements IView, IObserver {
//   /** Структорное представление страницы из компонентов */
//   private element: ProfileModel;
//   private locId: string | null;
//   private subsIds: number[] = [];
//   /** Конструктор */
//   constructor() {
//     const user = store.getState().user as PayloadUser;
//     this.locId = new URL(location.href).searchParams.get('id');
//     this.element = new ProfileModel(
//         user.id.toString() == this.locId,
//     );
//     store.registerObserver(this);
//     getProfile(Number(new URL(location.href).searchParams.get('id')));
//   }
//   /** Оповещение об изменением хранилища */
//   notify(): void {
//     const profileNew =
//       store.getState().profile as PayloadGetProfileData | undefined;
//     if (!profileNew) {
//       return;
//     }
//     this.element.setType(profileNew.user.isAuthor);
//     this.element.renderNavbar(profileNew.user);
//     if (profileNew.user.isAuthor) {
//       this.element.renderAbout(profileNew.user.about);
//       this.element.renderSubContainer(profileNew.authorSubscriptions);
//       const subs =
//         store.getState().userSubscribers as Subscription[] | undefined;
//       if (subs && profileNew.user.id !== Number(this.locId)) {
//         const subsIds: number[] = [];
//         subs.forEach((sub) => sub.id ? subsIds.push(sub.id) : null);
//         subsIds.filter((x) => !this.subsIds.includes(x)).forEach((id) =>
//           this.element.renderSubscribe(id, Number(this.locId)));
//         this.subsIds.filter((x) => !subsIds.includes(x)).forEach((id) =>
//           this.element.renderUnsubscribe(id, Number(this.locId)));
//         this.subsIds = subsIds;
//       }
//     } else {
//       this.element.renderSubscriptions(profileNew.subscriptions);
//     }
//   }
//   /** Сброс страницы, отключение от хранилища */
//   reset(): void {
//     store.removeObserver(this);
//     this.element.element.remove();
//   }
//   /**
//    * Создание страницы профиля
//    * @returns Страница-элемент
//    */
//   render(): HTMLElement {
//     this.element.renderAbout(undefined);
//     this.element.renderSubContainer(undefined);
//     return this.element.element;
//   }
// }
