import Button, {ButtonType} from '@components/Button/Button';
import {Glass, GlassType} from '@components/glass/glass';
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
      switch (data.subscriptionStatus) {
        case SubscriptionCardStatus.ALREADY_DONATED:
          this.button.update({
            inner: 'Отписаться',
          });
          this.button.addClassNames('sub__button_style_owner');
          this.button.removeClassName('sub__button_style_donater');
          break;
        case SubscriptionCardStatus.CAN_DONATE:
          this.button.update({
            inner: 'Задонатить',
          });
          this.button.removeClassName('sub__button_style_owner');
          this.button.addClassNames('sub__button_style_donater');
          break;
      }
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
    const card = new Glass(GlassType.mono).element;
    card.id = `sub_${this.options.subscriptionID}`;
    card.innerHTML = template({
      id: this.options.subscriptionID,
      subName: this.options.subscriptionName,
      lvl: this.options.lvl.toString(),
      price: this.options.price,
      description: this.options.description,
    });
    this.name = querySelectorWithThrow(card, '.sub__name');
    this.lvl = querySelectorWithThrow(card, '.sub__lvl');
    const imageArea = querySelectorWithThrow(card, '.sub__img');
    imageArea.style.display = 'contents';

    this.avatar = new Avatar(imageArea, {
      viewType: AvatarType.SUBSCRIPTION,
      imgPath: this.options.img,
    });
    this.avatar.addClassNames('sub__img');

    this.addButton(card);
    this.price = querySelectorWithThrow(card, '.price__count');
    this.description = querySelectorWithThrow(card, '.sub__motivation');
    if (this.options.description.length >= 60) {
      this.description.classList.add('sub__motivation_part');
      const showMore = document.createElement('a');
      showMore.classList.add('sub__more');
      showMore.textContent = 'показать еще';
      showMore.addEventListener('click', () => {
        this.description.classList.remove('sub__motivation_part');
        showMore.hidden = true;
      });
      card.firstChild?.appendChild(showMore);
    }

    return card;
  }

  private addButton(card: HTMLDivElement) {
    const btnArea = querySelectorWithThrow(card, '.sub__button');
    btnArea.style.display = 'contents';
    switch (this.options.subscriptionStatus) {
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
        this.button.addClassNames('sub__button_style_donater');
        break;
      case SubscriptionCardStatus.ALREADY_DONATED:
        this.button = new Button(btnArea, {
          viewType: ButtonType.PRIMARY,
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
        this.button.addClassNames('sub__button_style_owner');
        break;
      case SubscriptionCardStatus.AUTHOR:
        this.button = new Button(btnArea, {
          viewType: ButtonType.PRIMARY,
          actionType: 'button',
          innerText: 'Изменить',
          clickHandler: () => {
            openSubscribtionEditor(this.options.subscriptionID);
          },
        });
        this.button.addClassNames('sub__button_style_author');
        break;
      default: {
        const _: never = this.options.subscriptionStatus;
        return _;
      }
    }
    this.button.addClassNames('sub__button');
  }
}
