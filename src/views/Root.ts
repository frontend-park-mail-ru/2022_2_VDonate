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
import ProfilePage from './pages/ProfilePage/ProfilePage';
import {PayloadUser} from '@actions/types/user';
import FeedPage from './pages/FeedPage/FeedPage';

/** Класс корневой вьюшки */
export default class Root extends ViewBaseExtended<PayloadLocation> {
  // private page: RootModel;
  /** Состояния расположения в приложении */
  private locationState: PayloadLocation;
  private navbar?: Navbar;
  private currentPage?:
    | NotFoundPage
    | PreloadPage
    | EntryPage
    | SearchPage
    | ProfilePage
    | FeedPage;

  constructor(el: HTMLElement) {
    super();
    this.locationState = store.getState().location as PayloadLocation;
    this.renderTo(el);
    this.update(this.locationState);
    auth();
  }

  /** Оповещение об изменением хранилища */
  notify(): void {
    const locationNew = store.getState().location as PayloadLocation;
    if (locationNew.type !== this.locationState.type ||
        locationNew.options?.id != this.locationState.options?.id) {
      this.locationState = locationNew;
      this.update(this.locationState);
    }
  }

  update(location: PayloadLocation): void {
    this.currentPage?.erase();
    switch (location.type) {
      case Pages.PRELOAD:
        if (this.navbar) {
          this.navbar.erase();
          this.navbar = undefined;
        }
        this.currentPage = new PreloadPage(this.domElement);
        break;
      case Pages.LOGIN:
        if (this.navbar) {
          this.navbar.erase();
          this.navbar = undefined;
        }
        this.currentPage = new EntryPage(this.domElement, {
          type: EntryFormType.LOGIN,
        });
        break;
      case Pages.SIGNUP:
        if (this.navbar) {
          this.navbar.erase();
          this.navbar = undefined;
        }
        this.currentPage = new EntryPage(this.domElement, {
          type: EntryFormType.SIGNUP,
        });
        break;
      case Pages.SEARCH:
        if (!this.navbar) {
          this.navbar = new Navbar(
              this.domElement,
              (store.getState().user as PayloadUser).id,
          );
        }
        this.currentPage = new SearchPage(this.domElement);
        break;
      case Pages.PROFILE:
        if (!this.navbar) {
          this.navbar = new Navbar(
              this.domElement,
              (store.getState().user as PayloadUser).id,
          );
        }
        this.currentPage = new ProfilePage(this.domElement, {
          profileID:
            Number(new URL(window.location.href).searchParams.get('id')),
          changeable:
          Number(new URL(window.location.href).searchParams.get('id')) ==
              (store.getState().user as PayloadUser).id,
        });
        break;
      case Pages.FEED:
        if (!this.navbar) {
          this.navbar = new Navbar(
              this.domElement,
              (store.getState().user as PayloadUser).id,
          );
        }
        this.currentPage = new FeedPage(this.domElement);
        break;
      case Pages.NOT_FOUND:
        if (!this.navbar) {
          this.navbar = new Navbar(
              this.domElement,
              (store.getState().user as PayloadUser).id,
          );
        }
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

    // this.navbar = new Navbar(root);
    new EditorContainer(root);
    new NoticeContainer(root);
    // this.update(this.locationState);

    return root;
  }
}
