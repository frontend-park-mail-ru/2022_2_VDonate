import './navbar.styl';
import {Glass, GlassType} from '@components/glass/glass';
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

  private profileMini!: ProfielMini;
  private subscriptionsListContainer!: SubscriptionsListContainer;

  constructor(el: HTMLElement, private options: number) {
    super();
    this.renderTo(el);
    getSubscritions(options);
  }

  protected render(): HTMLDivElement {
    const navbar = document.createElement('div');
    navbar.classList.add('left-navbar');

    const glass = new Glass(GlassType.mono).element;
    glass.classList.add('left-navbar__glass');
    navbar.appendChild(glass);

    const logo = new Logo(glass);
    logo.addClassNames('left-navbar__logo');

    const linkes = document.createElement('div');
    links.forEach(({icon, text, link}) => {
      this.navbarLinks.push(new NavbarLink(linkes, {
        isActive: false,
        href: link,
        icon,
        text,
      }));
    });

    glass.appendChild(linkes);
    glass.innerHTML += '<hr class="navbar-hr navbar-hr__navbar-hr">';

    this.subscriptionsListContainer = new SubscriptionsListContainer(glass);
    this.subscriptionsListContainer.addClassNames('left-navbar__subs-list');

    const profileContainer = document.createElement('div');
    profileContainer.classList.add('left-navbar__down', 'down');
    profileContainer.innerHTML +=
      '<hr class="navbar-hr navbar-hr__navbar-hr">';

    this.profile = document.createElement('div');
    this.profile.classList.add('down__profile');

    this.profileMini = new ProfielMini(this.profile, {
      username: '',
      avatar: '',
      isAuthor: false,
      id: this.options,
      type: ProfileMiniType.SESSION_PROFILE,
    });

    const popup = new Glass(GlassType.lines).element;
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
    menuBtn.addClassNames('down__menu-btn');

    popup.style.display = 'none';
    popup.classList.add('down__popup');

    const profileLink = new Button(popup, {
      viewType: ButtonType.OUTLINE,
      actionType: 'button',
      innerText: 'Профиль',
      clickHandler: () => {
        const user = store.getState().user as PayloadUser;
        routing(`/profile?id=${user.id}`);
      },
    });
    profileLink.addClassNames('down__popup-btn');

    const change = new Button(popup, {
      viewType: ButtonType.OUTLINE,
      actionType: 'button',
      innerText: 'Изменить данные',
      clickHandler: () => {
        openProfileEditor();
      },
    });
    change.addClassNames('down__popup-btn');

    const logoutBtn = new Button(popup, {
      viewType: ButtonType.OUTLINE,
      actionType: 'button',
      innerText: 'Выйти',
      clickHandler: () => {
        logout();
      },
    });
    logoutBtn.addClassNames('down__popup-btn');

    profileContainer.appendChild(this.profile);
    glass.appendChild(profileContainer);
    // this.renderLocation(ChoosenLink.FEED);
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
  // renderLocation(page: ChoosenLink) {
  //   switch (page) {
  //     case ChoosenLink.FEED:
  //       this.navbarLinks[0].update(true);
  //       this.navbarLinks[1].update(false);
  //       this.navbarLinks[2].update(false);
  //       break;
  //     case ChoosenLink.SEARCH:
  //       this.navbarLinks[0].update(false);
  //       this.navbarLinks[1].update(true);
  //       this.navbarLinks[2].update(false);
  //       break;
  //     case ChoosenLink.SUBSCRIBTIONS:
  //       this.navbarLinks[0].update(false);
  //       this.navbarLinks[1].update(false);
  //       this.navbarLinks[2].update(true);
  //       break;
  //     default:
  //       this.navbarLinks[0].update(false);
  //       this.navbarLinks[1].update(false);
  //       this.navbarLinks[2].update(false);
  //       break;
  //   }
  // }

  /** функция скрывающая navbar */
  hideNavbar() {
    this.domElement.style.display = 'none';
  }
  /** функция показывающая navbar */
  showNavbar() {
    this.domElement.removeAttribute('style');
  }
}
