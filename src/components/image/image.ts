import './image.styl';
import altImg from '@img/0.jpg';

/**
 * Перечисление типов аватара
 */
export enum ImageType {
  donater,
  author,
  sub,
}

/**
 * Компонент аватар
 */
export class Image {
  /**
   * Актуальный контейнер стекла
   */
  readonly element: HTMLElement;

  /**
   * @param viewType вид аватара
   * @param image url аватара
   */
  constructor(
      viewType: ImageType,
      image: string,
  ) {
    this.element = document.createElement('img');
    this.element.classList.add('image');
    switch (viewType) {
      case ImageType.author:
        this.element.classList.add('image__author');
        break;
      case ImageType.donater:
        this.element.classList.add('image__donater');
        break;
      case ImageType.sub:
        this.element.classList.add('image__sub');
        break;
      default:
        break;
    }
    // this.element.setAttribute('style', `width: ${size}`);
    if (image) {
      this.element.setAttribute('src', image);
    } else {
      this.element.setAttribute('src', altImg);
    }
  }
}
