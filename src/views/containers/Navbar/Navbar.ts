import './navbar.styl';
import menuIcon from '@icon/menu.svg';
import feedIcon from '@icon/feed.svg';
import searchIcon from '@icon/search.svg';
import store from '@app/Store';
import routing from '@actions/handlers/routing';
import {PayloadUser} from '@actions/types/user';
import {logout} from '@actions/handlers/user';
import {openProfileEditor} from '@actions/handlers/editor';
import Logo from '@components/Logo/Logo';
import NavbarLink from '@components/NavbarLink/NavbarLink';
import Button, {ButtonType} from '@components/Button/Button';
import {getSubscriptions} from '@actions/handlers/subscribe';
import ProfileMini, {ProfileMiniType}
  from '@components/ProfileMini/ProfileMini';
import SubscriptionsListContainer
  from '../SubscriptionsListContainer/SubscriptionsListContainer';
import UpgradeViewBase from '@app/UpgradeView';
import {PayloadLocation} from '@actions/types/routing';
import {Pages} from '@configs/router';
import NoticeBell from '@components/NoticeBell/NoticeBell';
import SubMenu, {SubMenuType} from '@components/SubMenu/SubMenu';
import ws from '@app/WebSocketNotice';
import {PayloadBackNotice} from '@actions/types/backNotice';

const links = [
  {
    icon: feedIcon,
    text: 'Лента',
    link: '/feed',
  },
  {
    icon: searchIcon,
    text: 'Поиск',
    link: '/search',
  },
];

/**
 * Модель левого навбара
 */
export default class Navbar extends UpgradeViewBase {
  private navbarLinks: NavbarLink[] = [];
  private profile!: HTMLElement;
  private locationState: PayloadLocation;
  private profileMini!: ProfileMini;
  private subscriptionsListContainer!: SubscriptionsListContainer;
  private noticeBell!: NoticeBell;
  private backNoticeCount: number;

  constructor(el: HTMLElement, private options: number) {
    super();
    this.locationState = store.getState().location as PayloadLocation;
    this.backNoticeCount =
      (store.getState().backNotice as PayloadBackNotice[]).length;
    this.renderTo(el);
    getSubscriptions(options);
  }

  protected render(): HTMLDivElement {
    const navbar = document.createElement('div');
    navbar.classList.add('navbar');

    const back = document.createElement('div');
    back.classList.add('navbar__back', 'bg_main');
    navbar.appendChild(back);

    const logo = new Logo(back);
    logo.addClassNames('navbar__logo');

    links.forEach(({icon, text, link}) => {
      const linkComponent = new NavbarLink(back, {
        isActive: false,
        href: link,
        icon,
        text,
      });
      linkComponent.addClassNames('navbar__link');
      this.navbarLinks.push(linkComponent);
    });

    const hr = document.createElement('hr');
    hr.classList.add('navbar-hr', 'bg_hr');
    back.appendChild(hr);

    this.subscriptionsListContainer = new SubscriptionsListContainer(back);
    this.subscriptionsListContainer.addClassNames('navbar__subs-list');

    back.appendChild(hr.cloneNode());

    const profileContainer = document.createElement('div');
    profileContainer.classList.add('navbar__bottom-area', 'bottom-area');

    this.profile = document.createElement('div');
    this.profile.classList.add('bottom-area__profile');

    this.profileMini = new ProfileMini(this.profile, {
      username: '',
      avatar: '',
      isAuthor: false,
      id: this.options,
      type: ProfileMiniType.SESSION_PROFILE,
    });
    this.profileMini.addClassNames('bottom-area__profile-mini');

    const noticeSubMenu = new SubMenu(navbar, {
      type: SubMenuType.NOTICE,
      buttonsOptions: [
        {
          actionType: 'button',
          viewType: ButtonType.OUTLINE,
          innerText: 'Удалить все',
          clickHandler: ws.clearAll.bind(ws),
        },
      ],
    });

    const profileSubMenu = new SubMenu(navbar, {
      type: SubMenuType.PROFILE,
      buttonsOptions: [
        {
          viewType: ButtonType.OUTLINE,
          actionType: 'button',
          innerText: 'Профиль',
          clickHandler: () => {
            const user = store.getState().user as PayloadUser;
            routing(`/profile?id=${user.id}`);
          },
        },
        {
          viewType: ButtonType.OUTLINE,
          actionType: 'button',
          innerText: 'Изменить данные',
          clickHandler: openProfileEditor,
        },
        {
          viewType: ButtonType.OUTLINE,
          actionType: 'button',
          innerText: 'Выйти',
          clickHandler: logout,
        },
      ],
    });

    this.noticeBell = new NoticeBell(this.profile, {
      hasNewNotices: true,
      onClick() {
        noticeSubMenu.update('toggle');
        profileSubMenu.update('disable');
      },
    });
    this.noticeBell.addClassNames('bottom-area__notice-bell');
    if (this.backNoticeCount > 0) {
      this.noticeBell.update(true);
    }


    new Button(this.profile, {
      viewType: ButtonType.ICON,
      clickHandler: () => {
        profileSubMenu.update('toggle');
        noticeSubMenu.update('disable');
      },
      actionType: 'button',
      innerIcon: menuIcon,
    });


    profileContainer.appendChild(this.profile);
    back.appendChild(profileContainer);
    this.renderLocation(this.locationState.type);
    return navbar;
  }

  /** Callback метод обновления хранилища */
  notify(): void {
    const user =
      store.getState().user as PayloadUser;
    this.profileMini.update({
      avatar: user.avatar,
      username: user.username,
      isAuthor: user.isAuthor,
    });

    const locationNew = store.getState().location as PayloadLocation;
    if (this.locationState.type !== locationNew.type) {
      this.locationState = locationNew;
      this.renderLocation(locationNew.type);
    }

    const backNoticeCountNew =
      (store.getState().backNotice as PayloadBackNotice[]).length;
    if (backNoticeCountNew === 0) {
      this.noticeBell.update(false);
    } else {
      this.noticeBell.update(true);
    }
  }

  protected onErase(): void {
    this.navbarLinks.forEach((link) => {
      link.remove();
    });
    this.subscriptionsListContainer.erase();
    this.profileMini.remove();
  }

  /**
   * рендер выбора локации
   * @param page -
   */
  renderLocation(page: Pages) {
    switch (page) {
      case Pages.FEED:
        this.navbarLinks[0].update(true);
        this.navbarLinks[1].update(false);
        break;
      case Pages.SEARCH:
        this.navbarLinks[0].update(false);
        this.navbarLinks[1].update(true);
        break;
      default:
        this.navbarLinks.forEach((link) => {
          link.update(false);
        });
        break;
    }
  }

  /** функция скрывающая navbar */
  hideNavbar() {
    this.domElement.style.display = 'none';
  }
  /** функция показывающая navbar */
  showNavbar() {
    this.domElement.removeAttribute('style');
  }
}
