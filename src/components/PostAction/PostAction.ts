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
      const icon =
        querySelectorWithThrow(this.domElement, '.post-action__icon');
      if (this.options.isActive) {
        icon.classList.add('post-action__icon_liked');
      } else {
        icon.classList.remove('post-action__icon_liked');
      }
    }
    if (this.options.count !== data.likesNum) {
      this.options.count = data.likesNum;
      const a = querySelectorWithThrow(this.domElement, '.post-action__text');
      a.textContent =
        this.options.count.toString();
    }
  }

  protected render(): HTMLButtonElement {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add(
        'post-action',
        'post-action__back',
        'bg_button_action');
    button.addEventListener('click', this.options.clickCallback);
    const innerIcon = document.createElement('img');
    innerIcon.className = 'post-action__icon';
    switch (this.options.reactType) {
      case PostActionType.COMMENT:
        innerIcon.src = commentIcon;
        button.appendChild(innerIcon);
        break;
      case PostActionType.LIKE:
        innerIcon.src = likeIcon;
        if (this.options.isActive) {
          innerIcon.classList.add('post-action__icon_liked');
        }
        button.appendChild(innerIcon);
        break;
      default:
        break;
    }
    const innerText = document.createElement('span');
    innerText.classList.add('post-action__text', 'font_regular');
    innerText.textContent = this.options.count.toString();
    button.appendChild(innerText);

    return button;
  }
}
