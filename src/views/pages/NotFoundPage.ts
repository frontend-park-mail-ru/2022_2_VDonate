import PageBase from '@app/Page';
import img404 from '@img/404.png';
/**
 * Реализация интерфейса *IView* для несуществующе страницы
 */
export default class NotFoundPage extends PageBase {
  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const page = document.createElement('div');
    const image = document.createElement('img');
    image.style.position = 'absolute';
    image.style.width = '20vw';
    image.style.left = '40vw';
    image.src = img404;
    image.alt = '404 error';
    image.width = 500;
    page.appendChild(image);
    return page;
  }

  notify(): void {
    return;
  }

  protected onErase(): void {
    return;
  }
}
