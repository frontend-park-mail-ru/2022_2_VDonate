import auth from '@actions/handlers/auth';
import {PayloadLocation} from '@actions/types/routing';
import store from '@app/store';
import {Pages} from '@configs/router';
import {IObserver} from '@flux/types/observer';
import {IView} from '@flux/types/view';
import PreloadPage from './pages/preloadPage';
import EntryPage, {EntryFormType} from './pages/entry-page/entryPage';
import NotFoundPage from './pages/notFoundPage';

/** Класс корневой вьюшки */
export default class Root implements IView, IObserver {
  /** Состояния расположения в приложении */
  private location: PayloadLocation;
  /** Отображаемая страница */
  private currentPage: IView | undefined;
  /** Элемент, к которому необходимо присоеденить страницу */
  readonly rootElement: HTMLElement;
  /**
   * Конструктор
   * @param rootElement - корневой элемент для вставки страницы
   */
  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.location = store.getState().location as PayloadLocation;
    rootElement.appendChild(this.render());
    store.registerObserver(this);
    auth();
  }
  /** Оповещение об изменением хранилища */
  notify(): void {
    const locationNew = store.getState().location as PayloadLocation;
    if (JSON.stringify(locationNew) !== JSON.stringify(this.location)) {
      this.location = locationNew;
      this.rootElement.appendChild(this.render());
    }
  }
  /** Сброс страницы */
  reset(): void {
    if (!this.currentPage) {
      return;
    }
    this.currentPage.reset();
    this.currentPage = undefined;
  }
  /**
   * Отрисовка старницы по урлу
   * @returns Страница-элемент для вставки в body
   */
  render(): HTMLElement {
    this.reset();
    switch (this.location.type) {
      case Pages.PRELOAD:
        this.currentPage = new PreloadPage();
        return this.currentPage.render();
      case Pages.LOGIN:
        this.currentPage = new EntryPage(EntryFormType.logIn);
        return this.currentPage.render();
      case Pages.SIGNUP:
        this.currentPage = new EntryPage(EntryFormType.signUp);
        return this.currentPage.render();
      case Pages.LOGOUT:
      case Pages.PROFILE:
      case Pages.SEARCH:
      case Pages.FEED:
      case Pages.NOT_FOUND:
        this.currentPage = new NotFoundPage();
        return this.currentPage.render();
    }
  }
}
