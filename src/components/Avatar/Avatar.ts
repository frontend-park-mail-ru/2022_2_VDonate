import './image.styl';
import altAvatar from '@img/altAvatar.jpg';
import altAuthorSub from '@img/altAuthorSub.jpg';
import ComponentBase from '@flux/types/component';
/**
 * Перечисление типов аватара
 */
export enum AvatarType {
  donater,
  author,
  sub,
}
interface AvatarOptions {
  viewType: AvatarType
  image: string
}
/**
 * Компонент аватар
 */
export default class Avatar extends ComponentBase<HTMLImageElement, never> {
  constructor(element: HTMLElement, private options: AvatarOptions) {
    super(element);
  }

  protected render(): HTMLImageElement {
    const image = document.createElement('img');
    image.classList.add('image');
    switch (this.options.viewType) {
      case AvatarType.author:
        image.classList.add('image__author');
        break;
      case AvatarType.donater:
        image.classList.add('image__donater');
        break;
      case AvatarType.sub:
        image.classList.add('image__sub');
        break;
      default:
        break;
    }
    if (this.options.image) {
      image.setAttribute('src', this.options.image);
    } else {
      image.setAttribute(
          'src', this.options.viewType == AvatarType.sub ?
        altAuthorSub : altAvatar);
    }
    return image;
  }

  update(data: never): void {
    return data;
  }
}
