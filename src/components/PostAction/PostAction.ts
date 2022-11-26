import './post-action.styl';
import commentIcon from '@icon/comment.svg';
import likeIcon from '@icon/like.svg';
import ComponentBase from '@flux/types/component';

/**
 * Перечисление типов кнопок
 */
export enum PostActionType {
  LIKE,
  COMMENT,
}

interface PostActionOptions {
  reactType: PostActionType
  content: string
  isActive: boolean
  clickCallback: () => void
}

/**
 * Компонент кнопка
 */
export default
class PostAction extends ComponentBase<'button'> {
  constructor(el: HTMLElement, private options: PostActionOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLButtonElement {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add(
        'reaction',
        'reaction__back',
        'reaction__back_outline');
    button.addEventListener('click', this.options.clickCallback);
    const innerIcon = document.createElement('img');
    innerIcon.className = 'reaction__icon';
    switch (this.options.reactType) {
      case PostActionType.COMMENT:
        innerIcon.src = commentIcon;
        button.appendChild(innerIcon);
        break;
      case PostActionType.LIKE:
        innerIcon.src = likeIcon;
        if (this.options.isActive) {
          button.classList.add('reaction__like');
        }
        button.appendChild(innerIcon);
        break;
      default:
        break;
    }
    const innerText = document.createElement('span');
    innerText.classList.add('reaction__text');
    innerText.textContent = this.options.content;
    button.appendChild(innerText);

    return button;
  }

  update(data: never): void {
    return data;
  }
}
