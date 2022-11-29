import {PayloadLocation} from '@actions/types/routing';
import store from '@app/store';
import {Pages} from '@configs/router';
import PreloadPage from './pages/PreloadPage';
import EntryPage, {EntryFormType} from './pages/EntryPage/EntryPage';
import NotFoundPage from './pages/NotFoundPage';
import {auth} from '@actions/handlers/user';
import EditorContainer from './containers/EditorContainer/EditorContainer';
import NoticeContainer from './containers/NoticeContainer/NoticeContainer';
import ViewBaseExtended from '@app/view';
import Navbar from './containers/Navbar/Navbar';
import SearchPage from './pages/SearchPage/searchPage';

/** Класс корневой вьюшки */
export default class Root extends ViewBaseExtended<PayloadLocation> {
  // private page: RootModel;
  /** Состояния расположения в приложении */
  private locationState: PayloadLocation;
  private navbar!: Navbar;
  private currentPage?:
    | NotFoundPage
    | PreloadPage
    | EntryPage
    | SearchPage;

  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
    this.locationState = store.getState().location as PayloadLocation;
    this.update(this.locationState);
    auth();
  }

  /** Оповещение об изменением хранилища */
  notify(): void {
    const locationNew = store.getState().location as PayloadLocation;
    if (locationNew.type !== this.locationState.type) {
      this.locationState = locationNew;
      this.update(this.locationState);
    }
  }

  update(location: PayloadLocation): void {
    this.currentPage?.erase();
    switch (location.type) {
      case Pages.PRELOAD:
        this.navbar.hideNavbar();
        this.currentPage = new PreloadPage(this.domElement);
        break;
      case Pages.LOGIN:
        this.navbar.hideNavbar();
        this.currentPage = new EntryPage(this.domElement, {
          type: EntryFormType.LOGIN,
        });
        break;
      case Pages.SIGNUP:
        this.navbar.hideNavbar();
        this.currentPage = new EntryPage(this.domElement, {
          type: EntryFormType.SIGNUP,
        });
        break;
      case Pages.SEARCH:
        this.navbar.showNavbar();
        this.currentPage = new SearchPage(this.domElement);
        break;
      case Pages.PROFILE:
      case Pages.FEED:
      case Pages.NOT_FOUND:
        this.navbar.showNavbar();
        this.currentPage = new NotFoundPage(this.domElement);
        break;
      default: {
        const _: never = location.type;
        return _;
      }
    }
  }

  protected render(): HTMLDivElement {
    const root = document.createElement('div');
    root.style.display = 'contents';

    this.navbar = new Navbar(root);
    new EditorContainer(root);
    new NoticeContainer(root);

    return root;
  }
}
