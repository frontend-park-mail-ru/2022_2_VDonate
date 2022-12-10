import Button, {ButtonType} from '@components/Button/Button';
import {openPayEditor, openSubscribtionEditor} from '@actions/handlers/editor';
import './subscription-card.styl';
import template from './subscription-card.hbs';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import Avatar, {AvatarType} from '@components/Avatar/Avatar';

export enum SubscriptionCardStatus {
  ALREADY_DONATED,
  CAN_DONATE,
  AUTHOR,
}

interface SubscriptionCardOptions {
  subscriptionStatus: SubscriptionCardStatus,
  authorID: number,
  subscriptionID: number,
  subscriptionName: string,
  lvl: number,
  img: string,
  price: number,
  description: string,
}

interface SubscriptionCardUpdateContext {
  subscriptionStatus: SubscriptionCardStatus,
  subscriptionName: string,
  lvl: number,
  img: string,
  price: number,
  description: string,
}

/**
 * Модель уровня подписки
 */
export default
class SubscriptionCard
  extends ComponentBase<'div', SubscriptionCardUpdateContext> {
  private name!: HTMLElement;
  private lvl!: HTMLElement;
  private avatar!: Avatar;
  private price!: HTMLElement;
  private button!: Button;
  private description!: HTMLElement;

  constructor(el: HTMLElement, private options: SubscriptionCardOptions) {
    super();
    this.renderTo(el);
  }

  update(data: SubscriptionCardUpdateContext): void {
    if (data.subscriptionStatus !== this.options.subscriptionStatus) {
      this.button.remove();
      this.renderButton(data.subscriptionStatus);
      this.options.subscriptionStatus = data.subscriptionStatus;
    }
    if (data.subscriptionName !== this.options.subscriptionName) {
      this.name.innerText = data.subscriptionName;
      this.options.subscriptionName = data.subscriptionName;
    }
    if (data.lvl !== this.options.lvl) {
      this.lvl.innerText = data.lvl.toString();
      this.options.lvl = data.lvl;
    }
    if (data.img.length > 0 && data.img !== this.options.img) {
      this.avatar.update(data.img);
      this.options.img = data.img;
    }
    if (data.price !== this.options.price) {
      this.price.innerText = '&#8381;' + data.price.toString();
      this.options.price = data.price;
    }
    if (data.description !== this.options.description) {
      this.description.innerText = data.description;
    }
  }

  protected render(): HTMLDivElement {
    const card = document.createElement('div');
    card.classList.add(
        'subscription-card',
        'subscription-card__back',
        'bg_content',
    );
    card.id = `subscription-card_${this.options.subscriptionID}`;
    card.innerHTML = template({
      id: this.options.subscriptionID,
      subName: this.options.subscriptionName,
      lvl: this.options.lvl.toString(),
      price: this.options.price,
      description: this.options.description,
    });
    this.name = querySelectorWithThrow(card, '.subscription-card__title');
    this.lvl = querySelectorWithThrow(card, '.subscription-card__lvl');
    const imageArea = querySelectorWithThrow(card, '.subscription-card__img');
    imageArea.style.display = 'contents';

    this.avatar = new Avatar(imageArea, {
      viewType: AvatarType.SUBSCRIPTION,
      imgPath: this.options.img,
    });
    this.avatar.addClassNames('subscription-card__img');

    this.renderButton(this.options.subscriptionStatus, card);
    this.price = querySelectorWithThrow(card, '.price__count');
    this.description =
    querySelectorWithThrow(card, '.subscription-card__motivation');
    if (this.options.description.length >= 60) {
      this.description.classList.add('subscription-card__motivation_part');
      const showMore = document.createElement('a');
      showMore.classList.add('subscription-card__more', 'font-small');
      showMore.textContent = 'показать еще';
      showMore.addEventListener('click', () => {
        this.description.classList.remove('subscription-card__motivation_part');
        showMore.hidden = true;
      });
      card.firstChild?.appendChild(showMore);
    }

    return card;
  }

  private renderButton(
      status: SubscriptionCardStatus,
      domElement: HTMLElement = this.domElement,
  ) {
    const btnArea =
      querySelectorWithThrow(domElement, '.subscription-card__button');
    switch (status) {
      case SubscriptionCardStatus.CAN_DONATE:
        this.button = new Button(btnArea, {
          viewType: ButtonType.PRIMARY,
          actionType: 'button',
          innerText: 'Задонатить',
          clickHandler: () => {
            openPayEditor(
                this.options.authorID,
                this.options.subscriptionID,
                this.options.subscriptionStatus,
            );
          },
        });
        break;
      case SubscriptionCardStatus.ALREADY_DONATED:
        this.button = new Button(btnArea, {
          viewType: ButtonType.ERROR,
          actionType: 'button',
          innerText: 'Отписаться',
          clickHandler: () => {
            openPayEditor(
                this.options.authorID,
                this.options.subscriptionID,
                this.options.subscriptionStatus,
            );
          },
        });
        break;
      case SubscriptionCardStatus.AUTHOR:
        this.button = new Button(btnArea, {
          viewType: ButtonType.WARNING,
          actionType: 'button',
          innerText: 'Изменить',
          clickHandler: () => {
            openSubscribtionEditor(this.options.subscriptionID);
          },
        });
        break;
      default: {
        const _: never = status;
        return _;
      }
    }
    this.button.addClassNames('subscription-card__button');
  }
}
