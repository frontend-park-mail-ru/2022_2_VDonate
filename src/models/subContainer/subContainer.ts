import {
  PayloadAuthorSubscription} from '@actions/types/getProfileData';
import {IconButton} from '@components/icon_button/icon_button';
import {Sub} from '@models/sub/sub';
import './subContainer.styl';
import plusIcn from '@icon/plus.svg';
import {SubType} from '@models/popup/sub/popup';
import store from '@app/store';
import {PayloadUser} from '@actions/types/user';
import {Subscription} from '@actions/types/subscribe';
import {openSubscribtionEditor} from '@actions/handlers/editor';

/**
 * Модель поля подписок
 */
export class SubContainer {
  /**
   * Актуальный контейнер
   */
  readonly element: HTMLElement;

  private container: HTMLElement;

  /** конструктор
   * @param changeable возможность добавить подписку
  */
  constructor(changeable: boolean) {
    this.element = document.createElement('div');
    this.element.classList.add('sub-container');
    const head = document.createElement('div');
    head.classList.add('sub-container__head');
    head.innerText = 'Уровни подписок';
    if (changeable) {
      const redactBtn = new IconButton(plusIcn, 'button');
      redactBtn.element.classList.add('sub-container__head_btn');
      redactBtn.element.addEventListener('click', () => {
        openSubscribtionEditor();
      });
      head.appendChild(redactBtn.element);
    }
    this.container = document.createElement('div');
    this.container.classList.add('sub-container__container');
    this.element.appendChild(head);
    this.element.appendChild(this.container);
  }

  /**
   * @param subs элементы подписок
   */
  renderSubs(subs: PayloadAuthorSubscription[] | undefined) {
    if (!subs || subs.length == 0) {
      this.container.innerHTML = 'Пока что тут пусто';
      return;
    }
    this.container.innerHTML = '';
    const user = store.getState().user as PayloadUser;
    const subscriptions =
        store.getState().userSubscribers as Subscription[];
    subs.forEach((sub) => {
      let subType = SubType.SUBSCRIBE;
      if (user.id == sub.authorID) {
        subType = SubType.EDITSUBSCRIBE;
      } else {
        if (subscriptions.find((o) => o.id == sub.id)) {
          subType = SubType.UNSUBSCRIBE;
        }
      }
      const subItem = new Sub({
        AuthorID: sub.authorID,
        subType: subType,
        id: sub.id,
        subName: sub.title,
        lvl: sub.tier,
        img: sub.img,
        price: sub.price,
        period: 'за неделю',
        motivation: sub.text,
      });
      subItem.element.classList.add('sub-container__card');
      this.container.appendChild(subItem.element);
    });
  }
}
