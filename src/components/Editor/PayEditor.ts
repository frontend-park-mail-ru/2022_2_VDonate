import Button, {ButtonType} from '@components/Button/Button';
import './popup.styl';
import {subscribe, unsubscribe} from '@actions/handlers/subscribe';
import ComponentBase from '@flux/types/component';
import {SubscriptionCardStatus}
  from '@components/SubscriptionCard/SubscriptionCard';

interface PayEditorOptions {
  authorID: number,
  authorSubscriptionID: number,
  currentCardStatus: SubscriptionCardStatus,
}

/**
 * Модель окна подтверждения подписки
 */
export default
class PayEditor extends ComponentBase<'div'> {
  constructor(el: HTMLElement, private options: PayEditorOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const editor = document.createElement('div');
    editor.classList.add('sub-popup__back');

    const popupGlass = document.createElement('div');
    popupGlass.classList.add('sub-popup__glass', 'bg_content');
    editor.appendChild(popupGlass);

    const text = document.createElement('span');
    text.classList.add('sub-popup__text');
    popupGlass.appendChild(text);

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('sub-popup__btn-container');

    new Button(btnContainer, {
      actionType: 'button',
      viewType: ButtonType.OUTLINE,
      innerText: 'Отмена',
      clickHandler: () => {
        this.remove();
      },
    });

    switch (this.options.currentCardStatus) {
      case SubscriptionCardStatus.CAN_DONATE:
        new Button(btnContainer, {
          actionType: 'button',
          viewType: ButtonType.PRIMARY,
          innerText: 'Задонатить',
          clickHandler: () => {
            subscribe(this.options.authorID, this.options.authorSubscriptionID);
            this.remove();
          },
        });
        text.innerText = 'Вы действительно собиратесь задонатить?';
        break;
      case SubscriptionCardStatus.ALREADY_DONATED:
        new Button(btnContainer, {
          actionType: 'button',
          viewType: ButtonType.PRIMARY,
          innerText: 'Отписаться',
          clickHandler: () => {
            unsubscribe(
                this.options.authorID,
                this.options.authorSubscriptionID,
            );
            this.remove();
          },
        });
        text.innerText = 'Вы действительно собиратесь отписаться?';
        break;
      default:
        text.innerText = 'Ошибка';
        break;
    }

    popupGlass.appendChild(btnContainer);

    return editor;
  }

  update(data: never): void {
    return data;
  }
}
