// import store from '@app/store';
// import {IView} from '@flux/types/view';
// import {IObserver} from '@flux/types/observer';
// import {ProfileModel} from '@views/pages/profile/profileModel/profileModel';
// import {PayloadUser} from '@actions/types/user';
// import getProfile from '@actions/handlers/getProfileData';
// import {PayloadGetProfileData} from '@actions/types/getProfileData';
// import {Subscription} from '@actions/types/subscribe';
// import ViewBaseExtended from '@app/view';
// import About from '@components/About/About';
// import ProfileInfo from '@components/ProfileInfo/ProfileInfo';
// import SubscriptionsContainer
// from '@views/containers/SubscriptionsContainer/SubscriptionsContainer';

// interface ProfileEditorOptions {
//   profileID: number
//   changeable: boolean
// }
// // Number(new URL(location.href).searchParams.get('id'))
// export default class ProfilePage extends ViewBaseExtended<never> {
//   // /** Структорное представление страницы из компонентов */
//   // private element: ProfileModel;
//   // private locId: string | null;
//   // private subsIds: number[] = [];
//   private about!: About;
//   private profileInfo!: ProfileInfo;
//   private subConatainer!: SubscriptionsContainer;
//   private profileState: PayloadGetProfileData;


//   constructor(el: HTMLElement, private options: ProfileEditorOptions) {
//     super();
//     this.profileState = store.getState().profile as PayloadGetProfileData;
//     this.renderTo(el);
//     getProfile(this.options.profileID);


//     // const user = store.getState().user as PayloadUser;
//     // this.locId = new URL(location.href).searchParams.get('id');
//     // this.element = new ProfileModel(
//     //     user.id.toString() == this.locId,
//     // );
//   }
//   protected beforeRegisterStore(): void {
//     getProfile(this.options.profileID);
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

//   protected render(): HTMLDivElement {
//     const page = document.createElement('div');
//     page.classList.add('content');

//     this.profileInfo = new ProfileInfo(page, {
//       avatar: this.profileState.user.avatar,
//       countSubscriptions: this.profileState.user.countSubscriptions,
//       isAuthor: this.profileState.user.isAuthor,
//       username: this.profileState.user.username,
//       countDonaters: this.profileState.user.countSubscribers,
//     });

//     this.subConatainer = new SubscriptionsContainer(page, {
//       changeable: this.options.changeable,
//     });

//     this.about = new About(page, {
//       aboutTextHtml: this.profileState.user.about ??
//         'Пользователь пока ничего о себе не написал',
//     });


//     // this.rightNavbar = new RightNavbar();
//     // this.subContainer = new SubContainer(changeable);
//     // this.about = new About();
//     this.head = document.createElement('div');
//     this.head.classList.add('content__head');
//     this.head.innerText = 'Подписки';
//     this.glass = new Glass(GlassType.mono);
//     this.glass.element.classList.add('content__glass');
//     this.element.appendChild(this.rightNavbar.element);

//     const user = store.getState().user as PayloadUser;
//     this.postContaner = new PostsContaner(changeable && user.isAuthor);

//     return page;
//   }
//   // /**
//   //  * Создание страницы профиля
//   //  * @returns Страница-элемент
//   //  */
//   // render(): HTMLElement {
//   //   this.element.renderAbout(undefined);
//   //   this.element.renderSubContainer(undefined);
//   //   return this.element.element;
//   // }
// }
