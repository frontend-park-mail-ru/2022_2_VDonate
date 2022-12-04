import './post-action.styl';
import commentIcon from '@icon/comment.svg';
import likeIcon from '@icon/like.svg';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';

/**
 * Перечисление типов кнопок
 */
export enum PostActionType {
  LIKE,
  COMMENT,
}

interface PostActionOptions {
  reactType: PostActionType
  count: number
  isActive: boolean
  clickCallback: () => void
}

interface PostActionUpdateContent {
  isActive: boolean
  likesNum: number
}
/**
 * Компонент кнопка
 */
export default
class PostAction extends ComponentBase<'button', PostActionUpdateContent> {
  constructor(el: HTMLElement, private options: PostActionOptions) {
    super();
    this.renderTo(el);
  }

  update(data: PostActionUpdateContent): void {
    if (this.options.reactType === PostActionType.COMMENT) return;
    if (this.options.isActive !== data.isActive) {
      this.options.isActive = data.isActive;
      if (this.options.isActive) {
        this.domElement.classList.add('reaction_like');
      } else {
        this.domElement.classList.remove('reaction_like');
      }
    }
    if (this.options.count !== data.likesNum) {
      this.options.count = data.likesNum;
      querySelectorWithThrow(this.domElement, '.reaction__count').textContent =
        this.options.count.toString();
    }
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
          button.classList.add('reaction_like');
        }
        button.appendChild(innerIcon);
        break;
      default:
        break;
    }
    const innerText = document.createElement('span');
    innerText.classList.add('reaction__text');
    innerText.textContent = this.options.count.toString();
    button.appendChild(innerText);

    return button;
  }
}
