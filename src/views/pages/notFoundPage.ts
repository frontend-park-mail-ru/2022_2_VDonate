import {IView} from '@flux/types/view';
import img404 from '@img/404.png';

/**
 * Реализация интерфейса *IView* для несуществующе страницы
 */
export default class NotFoundPage implements IView {
  /** Корневой элемент страницы */
  private image: HTMLImageElement;
  /** Контруктор */
  constructor() {
    this.image = document.createElement('img');
  }
  /** Сброс страницы */
  reset(): void {
    this.image.remove();
  }
  /**
   * Отрисовка страницы 404 ошибки
   * @returns Элемент-страница
   */
  render(): HTMLElement {
    this.image.src = img404;
    this.image.alt = '404 error';
    return this.image;
  }
}
