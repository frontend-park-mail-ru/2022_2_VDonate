import {
  PayloadAuthorSubscription} from '@actions/types/getProfileData';
import {IconButton} from '@components/icon_button/icon_button';
import {Sub} from '@models/sub/sub';
import './subContainer.styl';
import plusIcn from '@icon/plus.svg';
import {SubType} from '@models/popup/sub/popup';
import store from '@app/store';
import {PayloadUser} from '@actions/types/user';
import {PayloadGetSubscriptions} from '@actions/types/subscribe';

/**
 * Модель поля подписок
 */
export class SubContainer {
  /**
   * Актуальный контейнер
   */
  readonly element: HTMLElement;

  private container: HTMLElement;
  private subs: PayloadAuthorSubscription[] | undefined;

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
        store.getState().subscribe as PayloadGetSubscriptions | undefined;
    subs.forEach((sub) => {
      let subType = SubType.UNSUBSCRIBE;
      if (user.id == sub.author.id) {
        subType = SubType.EDITSUBSCRIBE;
      } else {
        if (subscriptions &&
           !subscriptions.error &&
           !subscriptions.subscriptions.find((o) => o.id == sub.id)) {
          subType = SubType.SUBSCRIBE;
        }
      }
      const subItem = new Sub({
        AuthorID: sub.author.id,
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
