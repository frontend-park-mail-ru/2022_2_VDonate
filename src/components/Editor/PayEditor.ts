// import {Glass, GlassType} from '@components/glass/glass';
// import Button, {ButtonType} from '@components/Button/Button';
// import './popup.styl';
// import {IObserver} from '@flux/types/observer';
// import store from '@app/store';
// import {subscribe, unsubscribe} from '@actions/handlers/subscribe';
// import {Subscription} from '@actions/types/subscribe';

// export enum SubType {
//   SUBSCRIBE,
//   UNSUBSCRIBE,
//   EDITSUBSCRIBE,
// }
// FIXME Переделать
// /**
//  * Модель окна подтверждения подписки
//  */
// export class Popup implements IObserver {
//   /**
//    * Актуальный контейнер
//    */
//   readonly element: HTMLElement;

//   private changeBtn: Button;
//   private authorSubscriptionID: number;
//   /**
//    * @param authorID ID автора
//    * @param authorSubscriptionID ID подписки
//    * @param subType тип
//    */
//   constructor(
//       authorID: number,
//       authorSubscriptionID: number,
//       subType: SubType,
//   ) {
//     this.authorSubscriptionID = authorSubscriptionID;
//     const popupGlass = new Glass(GlassType.lines);
//     popupGlass.element.classList.add('sub-popup__glass');
//     const darkening = document.createElement('div');
//     darkening.classList.add('sub-popup__back');
//     darkening.appendChild(popupGlass.element);
//     this.element = darkening;
//     const text = document.createElement('span');
//     text.classList.add('sub-popup__text');
//     popupGlass.element.appendChild(text);
//     const btnContainer = document.createElement('div');
//     btnContainer.classList.add('sub-popup__btn-container');
//     const cansel = new Button(ButtonType.outline, 'Отмена', 'button');
//     cansel.element.addEventListener('click', () => {
//       this.element.remove();
//     });
//     switch (subType) {
//       case SubType.SUBSCRIBE:
//         this.changeBtn =
//           new Button(ButtonType.primary, 'Задонатить', 'button');
//         text.innerText = 'Вы действительно собиратесь задонатить?';
//         this.changeBtn.element.addEventListener('click', () => {
//           subscribe(authorID, authorSubscriptionID);
//         });
//         break;
//       case SubType.UNSUBSCRIBE:
//         this.changeBtn =
//           new Button(ButtonType.primary, 'Отписаться', 'button');
//         text.innerText = 'Вы действительно собиратесь отписаться?';
//         this.changeBtn.element.addEventListener('click', () => {
//           unsubscribe(authorID, authorSubscriptionID);
//         });
//         break;
//       default:
//         this.changeBtn =
//           new Button(ButtonType.primary, 'Вернуться', 'button');
//         text.innerText = 'Ошибка';
//         this.changeBtn.element.addEventListener('click', () => {
//           this.element.remove();
//         });
//     }
//     btnContainer.appendChild(cansel.element);
//     btnContainer.appendChild(this.changeBtn.element);
//     popupGlass.element.appendChild(btnContainer);
//     store.registerObserver(this);
//   }

//   /** Callback метод обновления хранилища */
//   notify(): void {
//     const idx =
//       (store.getState().userSubscribers as Subscription[])
//           .findIndex((sub) => sub.id == this.authorSubscriptionID);
//     switch (this.changeBtn.element.firstElementChild?.innerHTML) {
//       case 'Задонатить':
//         // if (idx && idx > -1) {
//         //   this.element.remove();
//         //   store.removeObserver(this);
//         // } else {
//         //   console.warn('Ошибка при донате');
//         // }
//         this.element.remove();
//         store.removeObserver(this);
//         break;
//       case 'Отписаться':
//         if (!idx || idx == -1) {
//           this.element.remove();
//           store.removeObserver(this);
//         } else {
//           console.warn('Ошибка при отписке');
//         }
//         break;
//       default:
//         this.element.remove();
//         store.removeObserver(this);
//         break;
//     }
//   }
// }
