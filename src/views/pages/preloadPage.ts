import {IView} from '@flux/types/view';

/** Класс страницы предварительной загрузки */
export default class PreloadPage implements IView {
  /** Основной элемент страницы */
  private page: HTMLHeadingElement;
  /** Конструктор */
  constructor() {
    this.page = document.createElement('h1');
  }
  /** Сброс страницы */
  reset(): void {
    this.page.remove();
  }
  /**
   * Отрисовка страницы загрузки
   * @returns Элемент-страница
   */
  render(): HTMLElement {
    this.page.textContent = 'Жду ЧУДА!';
    return this.page;
  }
}
