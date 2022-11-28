// import Image, {ImageType} from '@components/mini-image/mini-image';
// import ComponentBase from '@flux/types/component';
// import './subscriptionItem.styl';

// interface SubscriptionLinkOptions {
//   id: number
//   imgPath: string
//   username: string
//   tier: number
// }
// FIXME Доделать
// /**
//  * Компонент элемента навбара
//  */
// export default
// class SubscriptionLink extends ComponentBase<HTMLAnchorElement, never> {
//   constructor(
// element: HTMLElement, private options: SubscriptionLinkOptions) {
//     super(element);
//   }
//   protected render(): HTMLAnchorElement {
//     const subscription = document.createElement('a');
//     subscription.setAttribute('href', `/profile?id=${this.options.id}`);
//     subscription.setAttribute('data-link', '');
//     subscription.classList
//         .add('subscriptions-item subscriptions-item__subscriptions-item');

//     const avatar = new Image(subscription, {
//       image: this.options.imgPath,
//       viewType: ImageType.author,
//     });
//     avatar.addClassNames('subscriptions-item__img');

//     const user = document.createElement('div');
//     user.classList.add('subscriptions-item__username');
//     user.innerText = this.options.username;
//     const lvl = document.createElement('div');
//     lvl.classList.add('subscriptions-item__tier');
//     lvl.innerText = `Уровень ${this.options.tier}`;

//     subscription.append(user, lvl);

//     return subscription;
//   }
//   update(data: never): void {
//     return data;
//   }
// }
