import Button, {ButtonType} from '@components/Button/Button';
import './editor.styl';
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
    editor.classList.add('editor', 'editor__back');

    const popupGlass = document.createElement('div');
    popupGlass.classList.add('editor__form', 'bg_editor');
    editor.appendChild(popupGlass);

    const text = document.createElement('span');
    text.classList.add('editor_header', 'font_big');
    popupGlass.appendChild(text);

    const btnArea = document.createElement('div');
    btnArea.classList.add('editor__btn-area', 'btn-area');

    switch (this.options.currentCardStatus) {
      case SubscriptionCardStatus.CAN_DONATE:
        new Button(btnArea, {
          actionType: 'button',
          viewType: ButtonType.PRIMARY,
          innerText: 'Задонатить',
          clickHandler: () => {
            subscribe(this.options.authorID, this.options.authorSubscriptionID);
            this.remove();
          },
        }).addClassNames('btn-area__btn');
        text.innerText = 'Вы действительно собиратесь задонатить?';
        break;
      case SubscriptionCardStatus.ALREADY_DONATED:
        new Button(btnArea, {
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
        }).addClassNames('btn-area__btn');
        text.innerText = 'Вы действительно собиратесь отписаться?';
        break;
      default:
        text.innerText = 'Ошибка';
        break;
    }

    new Button(btnArea, {
      actionType: 'button',
      viewType: ButtonType.OUTLINE,
      innerText: 'Отмена',
      clickHandler: () => {
        this.remove();
      },
    }).addClassNames('btn-area__btn');

    popupGlass.appendChild(btnArea);

    return editor;
  }

  update(data: never): void {
    return data;
  }
}
