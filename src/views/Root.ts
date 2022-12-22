import {PayloadLocation} from '@actions/types/routing';
import store from '@app/Store';
import {Pages} from '@configs/router';
import PreloadPage from './pages/PreloadPage';
import EntryPage, {EntryFormType} from './pages/EntryPage/EntryPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import {auth} from '@actions/handlers/user';
import EditorContainer from './containers/EditorContainer/EditorContainer';
import NoticeContainer from './containers/NoticeContainer/NoticeContainer';
import Navbar from './containers/Navbar/Navbar';
import SearchPage from './pages/SearchPage/SearchPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import {PayloadUser} from '@actions/types/user';
import FeedPage from './pages/FeedPage/FeedPage';
import UpgradeViewBase from '@app/UpgradeView';
import notice from '@actions/handlers/notice';

interface RootChildViews {
  navbar?: Navbar
  editor?: EditorContainer
  notice?: NoticeContainer
  page?:
    | NotFoundPage
    | PreloadPage
    | EntryPage
    | SearchPage
    | ProfilePage
    | FeedPage;
}

/** Класс корневой вьюшки */
export default class Root extends UpgradeViewBase {
  // private page: RootModel;
  /** Состояния расположения в приложении */
  private locationState: PayloadLocation;
  private childViews: RootChildViews = {};

  constructor(el: HTMLElement) {
    super();
    this.locationState = store.getState().location as PayloadLocation;
    this.renderTo(el);
    this.update(this.locationState);
    auth();
    window.addEventListener('offline', () => {
      notice('Проверьте подключение к интернету');
    });

    window.addEventListener('online', () => {
      notice('Подключение восстановлено');
    });
  }

  /** Оповещение об изменением хранилища */
  notify(): void {
    const locationNew = store.getState().location as PayloadLocation;
    if (!locationNew.options.samePage &&
        (locationNew.type !== this.locationState.type ||
        locationNew.options.id != this.locationState.options.id)) {
      this.locationState = locationNew;
      this.update(this.locationState);
    }
  }

  update(location: PayloadLocation): void {
    this.childViews.page?.erase();
    switch (location.type) {
      case Pages.PRELOAD:
        this.onlyAuthViews(false);
        this.childViews.page = new PreloadPage(this.domElement);
        break;
      case Pages.LOGIN:
        this.onlyAuthViews(false);
        this.childViews.page = new EntryPage(this.domElement, {
          type: EntryFormType.LOGIN,
        });
        break;
      case Pages.SIGNUP:
        this.onlyAuthViews(false);
        this.childViews.page = new EntryPage(this.domElement, {
          type: EntryFormType.SIGNUP,
        });
        break;
      case Pages.SEARCH:
        this.onlyAuthViews(true);
        this.childViews.page = new SearchPage(this.domElement);
        break;
      case Pages.PROFILE:
        this.onlyAuthViews(true);
        this.childViews.page = new ProfilePage(this.domElement, {
          profileID:
            Number(new URL(window.location.href).searchParams.get('id')),
          changeable:
          Number(new URL(window.location.href).searchParams.get('id')) ===
              (store.getState().user as PayloadUser).id,
        });
        break;
      case Pages.FEED:
        this.onlyAuthViews(true);
        this.childViews.page = new FeedPage(this.domElement);
        break;
      case Pages.NOT_FOUND:
        this.onlyAuthViews(false);
        this.childViews.page = new NotFoundPage(this.domElement);
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

    this.childViews.notice = new NoticeContainer(root);

    return root;
  }

  private onlyAuthViews(isActive: boolean) {
    if (isActive) {
      this.childViews.navbar = this.childViews.navbar ??
        new Navbar(
            this.domElement,
            (store.getState().user as PayloadUser).id,
        );
      this.childViews.editor = this.childViews.editor ??
        new EditorContainer(this.domElement);
    } else {
      this.childViews.navbar?.erase();
      this.childViews.navbar = undefined;

      this.childViews.editor?.erase();
      this.childViews.editor = undefined;
    }
  }

  protected onErase(): void {
    this.childViews.editor?.erase();
    this.childViews.navbar?.erase();
    this.childViews.notice?.erase();
    this.childViews.page?.erase();
  }
}
