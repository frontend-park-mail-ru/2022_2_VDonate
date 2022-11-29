import PageBase from '@app/Page';

/** Класс страницы предварительной загрузки */
export default class PreloadPage extends PageBase {
  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    return document.createElement('div');
  }

  notify(): void {
    return;
  }

  protected onErase(): void {
    return;
  }
}
