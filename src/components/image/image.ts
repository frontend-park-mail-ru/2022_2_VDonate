import './image.styl';

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
   * @param size размер аватара
   * @param image url аватара
   */
  constructor(
      viewType: ImageType,
      size: string,
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
    this.element.setAttribute('style', `width: ${size}`);
    this.element.setAttribute('src', image);
  }
}
