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
import {getSubscritions} from '@actions/handlers/subscribe';
import ProfielMini, {ProfileMiniType}
  from '@components/ProfileMini/ProfileMini';
import SubscriptionsListContainer
  from '../SubscriptionsListContainer/SubscriptionsListContainer';
import UpgradeViewBase from '@app/UpgradeView';
import {PayloadLocation} from '@actions/types/routing';
import {Pages} from '@configs/router';


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

export enum ChoosenLink {
  FEED,
  SEARCH,
  SUBSCRIBTIONS,
  OTHER,
}

/**
 * Модель левого навбара
 */
export default class Navbar extends UpgradeViewBase {
  private navbarLinks: NavbarLink[] = [];
  private profile!: HTMLElement;
  private locationState: PayloadLocation;
  private profileMini!: ProfielMini;
  private subscriptionsListContainer!: SubscriptionsListContainer;

  constructor(el: HTMLElement, private options: number) {
    super();
    this.locationState = store.getState().location as PayloadLocation;
    this.renderTo(el);
    getSubscritions(options);
  }

  protected render(): HTMLDivElement {
    const navbar = document.createElement('div');
    navbar.classList.add('navbar');

    const back = document.createElement('div');
    back.classList.add('navbar__back', 'bg_content');
    navbar.appendChild(back);

    const logo = new Logo(back);
    logo.addClassNames('navbar__logo');

    // const linkes = document.createElement('div');
    links.forEach(({icon, text, link}) => {
      this.navbarLinks.push(new NavbarLink(back, {
        isActive: false,
        href: link,
        icon,
        text,
      }));
    });

    // back.appendChild(linkes);

    const hr = document.createElement('hr');
    hr.classList.add('navbar-hr');
    back.appendChild(hr);

    this.subscriptionsListContainer = new SubscriptionsListContainer(back);
    this.subscriptionsListContainer.addClassNames('navbar__subs-list');

    back.appendChild(hr.cloneNode());

    const profileContainer = document.createElement('div');
    profileContainer.classList.add('navbar__botton-area', 'botton-area');

    this.profile = document.createElement('div');
    this.profile.classList.add('botton-area__profile');

    this.profileMini = new ProfielMini(this.profile, {
      username: '',
      avatar: '',
      isAuthor: false,
      id: this.options,
      type: ProfileMiniType.SESSION_PROFILE,
    });

    const popup = document.createElement('div');
    popup.classList.add('bg_content');
    popup.style.display = 'none';
    profileContainer.appendChild(popup);

    const menuBtn = new Button(this.profile, {
      viewType: ButtonType.ICON,
      actionType: 'button',
      innerIcon: menuIcon,
      clickHandler: () => {
        if (popup.style.display == 'none') {
          popup.style.display = 'flex';
        } else {
          popup.style.display = 'none';
        }
      },
    });
    menuBtn.addClassNames('botton-area__menu-btn');

    popup.style.display = 'none';
    popup.classList.add('botton-area__popup');

    const profileLink = new Button(popup, {
      viewType: ButtonType.OUTLINE,
      actionType: 'button',
      innerText: 'Профиль',
      clickHandler: () => {
        const user = store.getState().user as PayloadUser;
        routing(`/profile?id=${user.id}`);
      },
    });
    profileLink.addClassNames('botton-area__popup-btn');

    const change = new Button(popup, {
      viewType: ButtonType.OUTLINE,
      actionType: 'button',
      innerText: 'Изменить данные',
      clickHandler: () => {
        openProfileEditor();
      },
    });
    change.addClassNames('botton-area__popup-btn');

    const logoutBtn = new Button(popup, {
      viewType: ButtonType.OUTLINE,
      actionType: 'button',
      innerText: 'Выйти',
      clickHandler: () => {
        logout();
      },
    });
    logoutBtn.addClassNames('botton-area__popup-btn');

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
