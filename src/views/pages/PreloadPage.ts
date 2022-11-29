import ViewBaseExtended from '@app/view';

/** Класс страницы предварительной загрузки */
export default class PreloadPage extends ViewBaseExtended<never> {
  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    return document.createElement('div');
  }

  notify(): void {
    //
  }

  update(data: never): void {
    return data;
  }
}
