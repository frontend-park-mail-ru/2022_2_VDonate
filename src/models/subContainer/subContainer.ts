import {PayloadGetProfileData} from '@actions/types/getProfileData';
import store from '@app/store';
import {IconButton} from '@components/icon_button/icon_button';
import {IObserver} from '@flux/types/observer';
import {Sub} from '@models/sub/sub';
import './subContainer.styl';
import plusIcn from '@icon/plus.svg';

/**
 * Модель поля подписок
 */
export class SubContainer implements IObserver {
  /**
   * Актуальный контейнер
   */
  readonly element: HTMLElement;

  private container: HTMLElement;
  private subs: PayloadGetProfileData['authorSubscriptions'] | undefined;

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
    store.registerObserver(this);
  }

  /**
   * @param subs элементы подписок
   */
  renderSubs() {
    this.container.innerHTML = '';
    this.subs?.forEach((sub) => {
      const subItem = new Sub({
        id: '1', // TODO вроде раньше ID подписки было
        subName: sub.title,
        lvl: sub.tier.toString(),
        img: sub.img,
        price: sub.price.toString(),
        period: 'за неделю', // TODO на будущее
        motivation: sub.text,
      });
      subItem.element.classList.add('sub-container__card');
      this.container.appendChild(subItem.element);
    });
  }

  /** Callback метод обновления хранилища */
  notify(): void {
    const profileStore = store.getState().profile as PayloadGetProfileData;
    // if (
    //   JSON.stringify(profileStore.authorSubscriptions) !==
    //   JSON.stringify(this.subs)
    // ) {
    //   this.subs = profileStore.authorSubscriptions;
    //   this.renderSubs();
    // }
    this.subs = profileStore.authorSubscriptions;
    this.renderSubs();
  }
}
