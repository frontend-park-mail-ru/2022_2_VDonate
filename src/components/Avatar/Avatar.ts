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
export default class Avatar extends ComponentBase<'img', string> {
  constructor(el: HTMLElement, private options: AvatarOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLImageElement {
    const image = document.createElement('img');
    image.classList.add('image');
    switch (this.options.viewType) {
      case AvatarType.AUTHOR:
        image.classList.add('image_style_author');
        break;
      case AvatarType.DONATER:
        image.classList.add('image_style_donater');
        break;
      case AvatarType.SUBSCRIPTION:
        image.classList.add('image_style_sub');
        break;
      default:
        break;
    }
    image.src = this.options.imgPath ||
     (this.options.viewType == AvatarType.SUBSCRIPTION ?
        altSubscriptionAvatar : altAvatar);
    return image;
  }

  update(imgPath: string): void {
    if (this.options.imgPath === imgPath) return;
    this.options.imgPath = imgPath;

    this.domElement.src = this.options.imgPath ||
      (this.options.viewType == AvatarType.SUBSCRIPTION ?
        altSubscriptionAvatar : altAvatar);
  }
}
