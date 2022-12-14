import './avatar.styl';
import altAvatar from '@img/altAvatar.jpg';
import altSubscriptionAvatar from '@img/altAuthorSub.jpg';
import ComponentBase from '@flux/types/component';
/**
 * Перечисление типов аватара
 */
export enum AvatarType {
  DONATER,
  AUTHOR,
  SUBSCRIPTION,
}
interface AvatarOptions {
  viewType: AvatarType
  imgPath: string
}

/**
 * Компонент аватар
 */
export default class Avatar extends ComponentBase<'img', string | AvatarType> {
  constructor(el: HTMLElement, private options: AvatarOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLImageElement {
    const image = document.createElement('img');
    image.classList.add('avatar');
    switch (this.options.viewType) {
      case AvatarType.AUTHOR:
        image.classList.add('avatar_style_author');
        break;
      case AvatarType.DONATER:
        image.classList.add('avatar_style_donater');
        break;
      case AvatarType.SUBSCRIPTION:
        image.classList.add('avatar_style_subscription');
        break;
      default:
        break;
    }
    image.src = this.options.imgPath ||
     (this.options.viewType == AvatarType.SUBSCRIPTION ?
        altSubscriptionAvatar : altAvatar);
    return image;
  }

  update(data: string | AvatarType): void {
    if (typeof data === 'string') {
      this.updateImage(data);
    } else {
      this.updateViewType(data);
    }
  }

  private updateImage(imgPath: string): void {
    if (this.options.imgPath === imgPath) return;
    this.options.imgPath = imgPath;

    this.domElement.src = this.options.imgPath ||
      (this.options.viewType == AvatarType.SUBSCRIPTION ?
        altSubscriptionAvatar : altAvatar);
  }

  private updateViewType(viewType: AvatarType): void {
    if (this.options.viewType === viewType) return;

    switch (this.options.viewType) {
      case AvatarType.AUTHOR:
        this.domElement.classList.remove('avatar_style_author');
        break;
      case AvatarType.DONATER:
        this.domElement.classList.remove('avatar_style_donater');
        break;
      case AvatarType.SUBSCRIPTION:
        this.domElement.classList.remove('avatar_style_sub');
        break;
      default:
        break;
    }

    switch (viewType) {
      case AvatarType.AUTHOR:
        this.domElement.classList.add('avatar_style_author');
        break;
      case AvatarType.DONATER:
        this.domElement.classList.add('avatar_style_donater');
        break;
      case AvatarType.SUBSCRIPTION:
        this.domElement.classList.add('avatar_style_sub');
        break;
      default:
        break;
    }

    this.options.viewType = viewType;
  }
}
