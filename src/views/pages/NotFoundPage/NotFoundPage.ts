import UpgradeViewBase from '@app/UpgradeView';
import img404 from '@img/404.png';
import './not-found-page.styl';
/**
 * Реализация интерфейса *IView* для несуществующе страницы
 */
export default class NotFoundPage extends UpgradeViewBase {
  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const page = document.createElement('div');
    page.classList.add('not-found-page');
    const image = document.createElement('img');
    image.classList.add('not-found-page__image');
    image.src = img404;
    image.alt = '404 error';
    const link = document.createElement('a');
    link.classList.add('not-found-page__text', 'font_regular');
    link.href = '/';
    link.setAttribute('data-link', '');
    link.innerText = 'Вернуться на главную';
    page.append(image, link);
    return page;
  }

  notify(): void {
    return;
  }

  protected onErase(): void {
    return;
  }
}
