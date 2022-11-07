import {PayloadLocation} from '@actions/types/routing';
import store from '@app/store';
import {Pages} from '@configs/router';
import {IObserver} from '@flux/types/observer';
import {IView} from '@flux/types/view';
import PreloadPage from './pages/preloadPage';
import EntryPage, {EntryFormType} from './pages/entry-page/entryPage';
import NotFoundPage from './pages/notFoundPage';
import FeedPage from './pages/feed-page/feedPage';
import {PayloadNotice} from '@actions/types/notice';
import ProfilePage from './pages/profilePage';
import {LeftNavbar} from '@models/navbar/left/left_navbar';
import {auth} from '@actions/handlers/user';

/** Класс корневой вьюшки */
export default class Root implements IView, IObserver {
  /** Состояния расположения в приложении */
  private location: PayloadLocation;
  private notice: PayloadNotice;
  /** Отображаемая страница */
  private currentPage: IView | undefined;
  /** Элемент, к которому необходимо присоеденить страницу */
  readonly rootElement: HTMLElement;
  /** элемент левого навбара */
  private navbar: LeftNavbar;
  /**
   * Конструктор
   * @param rootElement - корневой элемент для вставки страницы
   */
  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    const state = store.getState();
    this.location = state.location as PayloadLocation;
    this.notice = state.notice as PayloadNotice;
    this.navbar = new LeftNavbar();
    rootElement.appendChild(this.navbar.element);
    rootElement.appendChild(this.render());
    store.registerObserver(this);
    auth();
  }
  /** Оповещение об изменением хранилища */
  notify(): void {
    const state = store.getState();
    const locationNew = state.location as PayloadLocation;

    this.notice = state.notice as PayloadNotice;
    if (this.notice.message) {
      console.warn(this.notice.message);
    }

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
        this.navbar.hideNavbar();
        this.currentPage = new PreloadPage();
        return this.currentPage.render();
      case Pages.LOGIN:
        this.navbar.hideNavbar();
        this.currentPage = new EntryPage(EntryFormType.logIn);
        return this.currentPage.render();
      case Pages.SIGNUP:
        this.navbar.hideNavbar();
        this.currentPage = new EntryPage(EntryFormType.signUp);
        return this.currentPage.render();
      case Pages.FEED:
        this.navbar.showNavbar();
        this.currentPage = new FeedPage();
        return this.currentPage.render();
      case Pages.PROFILE:
        this.navbar.showNavbar();
        this.currentPage = new ProfilePage();
        return this.currentPage.render();
      case Pages.SEARCH:
      case Pages.NOT_FOUND:
        this.currentPage = new NotFoundPage();
        return this.currentPage.render();
    }
  }
}
