import Button, {ButtonType} from '@components/Button/Button';
import {Glass, GlassType} from '@components/glass/glass';
import {openSubscribtionEditor} from '@actions/handlers/editor';
import './subscription-card.styl';
import template from './subscription-card.hbs';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import Avatar, {AvatarType} from '@components/Avatar/Avatar';
import PayEditor from '@components/Editor/PayEditor';

export enum SubscriptionCardStatus {
  OWNER,
  DONATER,
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
  subscriptionStatus?: SubscriptionCardStatus,
  subscriptionName?: string,
  img?: string,
  description?: string,
}

/**
 * Модель уровня подписки
 */
export default
class SubscriptionCard
  extends ComponentBase<'div', SubscriptionCardUpdateContext> {
  private button!: Button;
  private avatar!: Avatar;
  private description!: HTMLElement;

  constructor(el: HTMLElement, private options: SubscriptionCardOptions) {
    super();
    this.renderTo(el);
  }

  update(data: SubscriptionCardUpdateContext): void {
    switch (data.subscriptionStatus) {
      case SubscriptionCardStatus.OWNER:
        this.button.update({
          innerText: 'Отписаться',
          callback: () => {
            // TODO нельза так. Это в обход флакса
            new PayEditor(document.body, {
              authorID: this.options.authorID,
              authorSubscriptionID: this.options.subscriptionID,
              subType: this.options.subscriptionStatus,
            });
          },
        });
        break;
      case SubscriptionCardStatus.DONATER:
        this.button.update({
          innerText: 'Задонатить',
          callback: () => {
            // TODO нельза так. Это в обход флакса
            new PayEditor(document.body, {
              authorID: this.options.authorID,
              authorSubscriptionID: this.options.subscriptionID,
              subType: this.options.subscriptionStatus,
            });
          },
        });
        break;
    }
    if (data.img) {
      this.avatar.update(data.img);
    }
    if (data.description) {
      this.description.innerText = data.description;
    }
  }

  protected render(): HTMLDivElement {
    const card = new Glass(GlassType.mono).element;
    card.innerHTML = template({
      id: this.options.subscriptionID,
      subName: this.options.subscriptionName,
      lvl: '&#8381;' + this.options.lvl.toString(),
      price: this.options.price,
      description: this.options.description,
    });

    const imageArea = querySelectorWithThrow(card, '.sub__price_period__img');
    imageArea.style.display = 'contents';

    this.avatar = new Avatar(imageArea, {
      viewType: AvatarType.SUBSCRIPTION,
      image: this.options.img,
    });
    this.avatar.addClassNames('sub__img');

    this.addButton(card);

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
    const btnArea = querySelectorWithThrow(card, '.sub__price_period__btn');
    btnArea.style.display = 'contents';
    switch (this.options.subscriptionStatus) {
      case SubscriptionCardStatus.DONATER:
        this.button = new Button(btnArea, {
          viewType: ButtonType.PRIMARY,
          actionType: 'button',
          innerText: 'Задонатить',
          clickCallback: () => {
            // TODO нельза так. Это в обход флакса
            new PayEditor(document.body, {
              authorID: this.options.authorID,
              authorSubscriptionID: this.options.subscriptionID,
              subType: this.options.subscriptionStatus,
            });
          },
        });
        break;
      case SubscriptionCardStatus.OWNER:
        this.button = new Button(btnArea, {
          viewType: ButtonType.PRIMARY,
          actionType: 'button',
          innerText: 'Отписаться',
          clickCallback: () => {
            // TODO нельза так. Это в обход флакса
            new PayEditor(document.body, {
              authorID: this.options.authorID,
              authorSubscriptionID: this.options.subscriptionID,
              subType: this.options.subscriptionStatus,
            });
          },
        });
        break;
      case SubscriptionCardStatus.AUTHOR:
        this.button = new Button(btnArea, {
          viewType: ButtonType.PRIMARY,
          actionType: 'button',
          innerText: 'Изменить',
          clickCallback: () => {
            openSubscribtionEditor(this.options.subscriptionID);
          },
        });
        break;
      default: {
        const _: never = this.options.subscriptionStatus;
        return _;
      }
    }
    this.button.addClassNames('sub__button');
  }
}
