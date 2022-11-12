import {PayloadLocation} from '@actions/types/routing';
import store from '@app/store';
import {Pages} from '@configs/router';
import {IObserver} from '@flux/types/observer';
import {IView} from '@flux/types/view';
import PreloadPage from './pages/preloadPage';
import EntryPage, {EntryFormType} from './pages/entry-page/entryPage';
import NotFoundPage from './pages/notFoundPage';
import {PayloadNotice} from '@actions/types/notice';
import ProfilePage from './pages/profilePage';
import {LeftNavbar} from '@models/navbar/left/left_navbar';
import {auth} from '@actions/handlers/user';
import {PayloadEditor} from '@actions/types/editor';
import {EditorContainer} from './containers/editor/editor';
import {FormErrorType, PayloadFormError} from '@actions/types/formError';
import {NoticeContainer} from './containers/notice/notice';
import {getSubscritions} from '@actions/handlers/subscribe';
import {PayloadUser} from '@actions/types/user';
import FeedPage from './pages/feed-page/feedPage';
/** Тип структорного представления страницы из компонентов */
interface RootModel {
  root: HTMLElement
  children: {
    leftNavBar: LeftNavbar
    main?: IView
    editor: EditorContainer
    notice: NoticeContainer
  }
}
/** Класс корневой вьюшки */
export default class Root implements IView, IObserver {
  private page: RootModel;
  /** Состояния расположения в приложении */
  private locationState: PayloadLocation;
  private noticeState: PayloadNotice;
  private formErrors: PayloadFormError;
  private editorState: PayloadEditor;
  private user: PayloadUser | undefined;
  /**
   * Конструктор
   * @param rootElement - корневой элемент для вставки страницы
   */
  constructor(rootElement: HTMLElement) {
    const state = store.getState();
    this.locationState = state.location as PayloadLocation;
    this.noticeState = state.notice as PayloadNotice;
    this.editorState = state.editor as PayloadEditor;

    this.page = {
      root: rootElement,
      children: {
        leftNavBar: new LeftNavbar(),
        editor: new EditorContainer(),
        notice: new NoticeContainer(),
      },
    };

    rootElement.append(
        this.page.children.leftNavBar.element,
        this.page.children.editor.element,
        this.page.children.notice.element,
        this.render(),
    );

    store.registerObserver(this);
    auth();
  }
  /** Оповещение об изменением хранилища */
  notify(): void {
    const state = store.getState();

    const newUser = store.getState().user as PayloadUser;
    if (newUser !== this.user) {
      this.user = newUser;
      getSubscritions(newUser.id);
    }
    const noticeStateNew = state.notice as PayloadNotice;
    // TODO вызов оповещений ошибок
    if (JSON.stringify(noticeStateNew) !== JSON.stringify(this.noticeState)) {
      this.noticeState = noticeStateNew;
      if (typeof this.noticeState.message === 'string' &&
        /^[а-яёА-ЯЁ]/.test(this.noticeState.message)) {
        this.page.children.notice.addNotice(this.noticeState.message);
      }
      if (Array.isArray(this.noticeState.message)) {
        this.noticeState.message.forEach(
            (message) => this.page.children.notice.addNotice(message),
        );
      }
    }

    const formErrorsNew = state.formErrors as PayloadFormError;
    if (JSON.stringify(formErrorsNew) !== JSON.stringify(this.formErrors)) {
      this.formErrors = formErrorsNew;
      // TODO вызов отображения ошибок
      switch (this.formErrors?.type) {
        case FormErrorType.EDIT_USER:
        case FormErrorType.AUTHOR_SUBSCRIPTION:
          this.page.children.editor.displayErrors(this.formErrors);
          break;
        default:
          break;
      }
    }

    const editorNew = state.editor as PayloadEditor;
    if (JSON.stringify(editorNew) !== JSON.stringify(this.editorState)) {
      this.editorState = editorNew;
      this.page.children.editor.displayEditor(this.editorState);
    }

    const locationNew = state.location as PayloadLocation;
    if (JSON.stringify(locationNew) !== JSON.stringify(this.locationState)) {
      this.locationState = locationNew;
      this.page.root.appendChild(this.render());
    }
  }
  /** Сброс страницы */
  reset(): void {
    if (!this.page.children.main) {
      return;
    }
    this.page.children.main.reset();
    this.page.children.main = undefined;
  }
  /**
   * Отрисовка старницы по урлу
   * @returns Страница-элемент для вставки в body
   */
  render(): HTMLElement {
    this.reset();
    switch (this.locationState.type) {
      case Pages.PRELOAD:
        this.page.children.leftNavBar.hideNavbar();
        this.page.children.main = new PreloadPage();
        return this.page.children.main.render();
      case Pages.LOGIN:
        this.page.children.leftNavBar.hideNavbar();
        this.page.children.main = new EntryPage(EntryFormType.logIn);
        return this.page.children.main.render();
      case Pages.SIGNUP:
        this.page.children.leftNavBar.hideNavbar();
        this.page.children.main = new EntryPage(EntryFormType.signUp);
        return this.page.children.main.render();
      case Pages.PROFILE:
        this.page.children.leftNavBar.showNavbar();
        this.page.children.main = new ProfilePage();
        return this.page.children.main.render();
      case Pages.FEED:
        this.page.children.leftNavBar.showNavbar();
        this.page.children.main = new FeedPage();
        return this.page.children.main.render();
      case Pages.SEARCH:
      case Pages.NOT_FOUND:
        this.page.children.leftNavBar.showNavbar();
        this.page.children.main = new NotFoundPage();
        return this.page.children.main.render();
    }
  }
}
