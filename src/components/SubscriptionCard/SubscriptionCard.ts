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
  tier: number,
  img: string,
  price: number,
  description: string,
}

interface SubscriptionCardUpdateContext {
  subscriptionStatus: SubscriptionCardStatus,
  subscriptionName: string,
  tier: number,
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
  private tier!: HTMLElement;
  private avatar!: Avatar;
  private price!: HTMLElement;
  private button!: Button;
  private description!: HTMLElement;
  private showMore!: HTMLAnchorElement;

  constructor(el: HTMLElement, private options: SubscriptionCardOptions) {
    super();
    this.renderTo(el);
    this.hideCard();
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
    if (data.tier !== this.options.tier) {
      this.tier.innerText = 'Ранг ' + data.tier.toString();
      this.options.tier = data.tier;
    }
    if (data.img.length > 0 && data.img !== this.options.img) {
      this.avatar.update(data.img);
      this.options.img = data.img;
    }
    if (data.price !== this.options.price) {
      this.price.innerHTML = data.price.toString() + '&#8381;';
      this.options.price = data.price;
    }
    if (data.description !== this.options.description) {
      this.description.innerText = data.description;
      this.hideCard();
    }
  }

  protected render(): HTMLDivElement {
    const card = document.createElement('div');
    card.classList.add(
        'subscription-card',
        'subscription-card__back',
        'bg_main',
    );
    card.id = `subscription-card_${this.options.subscriptionID}`;
    card.innerHTML = template({
      id: this.options.subscriptionID,
      subName: this.options.subscriptionName,
      tier: this.options.tier.toString(),
      price: this.options.price,
      description: this.options.description,
    });
    this.name = querySelectorWithThrow(card, '.subscription-card__title');
    this.tier = querySelectorWithThrow(card, '.subscription-card__tier');
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

    this.showMore = document.createElement('a');
    this.showMore.classList.add('subscription-card__more', 'font_small');
    this.showMore.textContent = 'показать еще';
    this.showMore.addEventListener('click', () => {
      this.description.classList.remove('subscription-card__motivation_part');
      this.showMore.hidden = true;
    });

    return card;
  }

  private hideCard() {
    if (this.domElement.offsetHeight > 300) {
      this.description.classList.add('subscription-card__motivation_part');
      this.showMore.hidden = false;
      this.domElement.appendChild(this.showMore);
    } else {
      this.description.classList.remove('subscription-card__motivation_part');
      this.showMore.hidden = true;
    }
  }

  private renderButton(
      status: SubscriptionCardStatus,
      domElement: HTMLElement = this.domElement,
  ) {
    const btnArea =
      querySelectorWithThrow(domElement, '.subscription-card__btn-area');
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
          viewType: ButtonType.SUB1,
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
          viewType: ButtonType.SUB2,
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
