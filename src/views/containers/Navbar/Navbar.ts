import './navbar.styl';
import {Glass, GlassType} from '@components/glass/glass';
import menuIcon from '@icon/menu.svg';
import store from '@app/Store';
import routing from '@actions/handlers/routing';
import {PayloadUser} from '@actions/types/user';
import {logout} from '@actions/handlers/user';
import {Subscription} from '@actions/types/subscribe';
import {openProfileEditor} from '@actions/handlers/editor';
import Logo from '@components/Logo/Logo';
import NavbarLink from '@components/NavbarLink/NavbarLink';
import Button, {ButtonType} from '@components/Button/Button';
import Avatar, {AvatarType} from '@components/Avatar/Avatar';
import {getSubscritions} from '@actions/handlers/subscribe';
import ContainerBase from '@app/Container';


const links = [
  {
    icon: menuIcon,
    text: 'Лента',
    link: '/feed',
  },
  {
    icon: menuIcon,
    text: 'Поиск',
    link: '/search',
  },
  // {
  //   icon: menuIcon,
  //   text: 'Подписки',
  //   link: '/subsriptions',
  // },
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
export default class Navbar extends ContainerBase<never> {
  private navbarLinks: NavbarLink[] = [];
  private subsList!: HTMLElement;
  private profile!: HTMLElement;
  private user?: PayloadUser;
  private subs: Subscription[] = [];

  constructor(el: HTMLElement, private options: number) {
    super();
    this.renderTo(el);
    getSubscritions(options);
  }

  update(data: never): void {
    return data;
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
    linkes.classList.add('left-navbar__linkes');
    links.forEach(({icon, text, link}) => {
      this.navbarLinks.push(new NavbarLink(linkes, {
        href: link,
        icon,
        text,
      }));
    });
    glass.appendChild(linkes);
    glass.innerHTML += '<hr class="navbar-hr navbar-hr__navbar-hr">';
    this.subsList = document.createElement('div');
    this.subsList.classList.add('left-navbar__subs-list');
    glass.appendChild(this.subsList);

    const profileContainer = document.createElement('div');
    profileContainer.classList.add('left-navbar__down', 'down');
    profileContainer.innerHTML +=
    '<hr class="navbar-hr navbar-hr__navbar-hr">';
    this.profile = document.createElement('div');
    this.profile.classList.add('down__profile');
    this.profile.addEventListener('click', () => {
      const user = store.getState().user as PayloadUser;
      routing(`/profile?id=${user.id}`);
    });

    const popup = new Glass(GlassType.lines).element;
    popup.style.display = 'none';
    profileContainer.appendChild(popup);

    const menuBtn = new Button(profileContainer, {
      viewType: ButtonType.ICON,
      actionType: 'button',
      innerIcon: menuIcon,
      clickCallback: () => {
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
      clickCallback: () => {
        const user = store.getState().user as PayloadUser;
        routing(`/profile?id=${user.id}`);
      },
    });
    profileLink.addClassNames('down__popup-btn');

    const change = new Button(popup, {
      viewType: ButtonType.OUTLINE,
      actionType: 'button',
      innerText: 'Изменить данные',
      clickCallback: () => {
        openProfileEditor();
      },
    });
    change.addClassNames('down__popup-btn');

    const logoutBtn = new Button(popup, {
      viewType: ButtonType.OUTLINE,
      actionType: 'button',
      innerText: 'Выйти',
      clickCallback: () => {
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
    const newUser =
      store.getState().user as PayloadUser;
    this.user = newUser;
    this.renderProfile();


    const newSubscriptions =
      store.getState().userSubscribers as Subscription[] | undefined;
    if (newSubscriptions) {
      this.subs = newSubscriptions;
      this.renderSubs();
    }
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

  /**
     * рендер профиля
     */
  renderProfile() {
    if (!this.user) {
      return;
    }
    this.profile.innerHTML = '';
    const avatar = new Avatar(this.profile, {
      image: this.user.avatar,
      viewType: this.user.isAuthor ? AvatarType.AUTHOR : AvatarType.DONATER,
    });
    avatar.addClassNames('down__avatar');
    const usrname = document.createElement('span');
    usrname.classList.add('down__username');
    usrname.innerText = this.user.username;
    this.profile.appendChild(usrname);
  }

  /**
     * рендер подписок
     */
  renderSubs() {
    this.subsList.innerHTML = '';
    this.subs.forEach((subItem) => {
      const sub = document.createElement('a');
      if (subItem.authorID) {
        sub.setAttribute('href', `/profile?id=${subItem.authorID}`);
        sub.setAttribute('data-link', '');
      }
      sub.classList.add('left-navbar__sub');
      const avatar = new Avatar(sub, {
        image: subItem.authorAvatar ?? '',
        viewType: AvatarType.AUTHOR,
      });
      avatar.addClassNames('left-navbar__sub-avatar');
      const usrname = document.createElement('span');
      usrname.classList.add('left-navbar__sub-username');
      usrname.innerText = subItem.authorName ?? subItem.title;
      sub.appendChild(usrname);
      this.subsList.appendChild(sub);
    });
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
