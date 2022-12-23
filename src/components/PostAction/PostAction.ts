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
  blocked: boolean
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
    if (data.blocked) {
      this.domElement.children.item(0)?.removeAttribute('style');
      this.domElement.children.item(1)
          ?.setAttribute('style', 'visibility: hidden');
      this.domElement.disabled = true;
      return;
    } else {
      this.domElement.children.item(1)?.removeAttribute('style');
      this.domElement.children.item(0)
          ?.setAttribute('style', 'display: none');
      this.domElement.disabled = false;
    }
    if (this.options.isActive !== data.isActive) {
      this.options.isActive = data.isActive;
      if (this.options.isActive) {
        this.domElement.classList.add('post-action__back_pressed');
      } else {
        this.domElement.classList.remove('post-action__back_pressed');
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

    const loading = document.createElement('div');
    loading.classList.add('post-action__loading');
    loading.style.display = 'none';
    button.appendChild(loading);

    const innerIcon = document.createElement('img');
    innerIcon.className = 'post-action__icon';
    const innerText = document.createElement('span');
    switch (this.options.reactType) {
      case PostActionType.COMMENT:
        innerIcon.src = commentIcon;
        button.appendChild(innerIcon);
        break;
      case PostActionType.LIKE:
        innerIcon.src = likeIcon;
        if (this.options.isActive) {
          button.classList.add('post-action__back_pressed');
        }
        button.appendChild(innerIcon);
        break;
      default:
        break;
    }
    innerText.classList.add('post-action__text', 'font_regular');
    innerText.textContent = this.options.count.toString();
    button.appendChild(innerText);
    return button;
  }
}
