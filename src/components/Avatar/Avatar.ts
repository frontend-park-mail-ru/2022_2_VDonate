import './avatar.styl';
import altAvatar from '@img/altAvatar.jpg';
import altAuthorSub from '@img/altAuthorSub.jpg';
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
  image: string
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
        image.classList.add('image__author');
        break;
      case AvatarType.DONATER:
        image.classList.add('image__donater');
        break;
      case AvatarType.SUBSCRIPTION:
        image.classList.add('image__sub');
        break;
      default:
        break;
    }
    if (this.options.image) {
      image.setAttribute('src', this.options.image);
    } else {
      image.setAttribute(
          'src', this.options.viewType == AvatarType.SUBSCRIPTION ?
        altAuthorSub : altAvatar);
    }
    return image;
  }

  update(imgPath: string): void {
    this.domElement.src = imgPath;
  }
}
