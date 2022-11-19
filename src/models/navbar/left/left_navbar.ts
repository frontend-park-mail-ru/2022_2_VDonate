import './left_navbar.styl';
import {Glass, GlassType} from '@components/glass/glass';
import {NavbarUnit, OrientType} from '@components/navbar_unit/navbar_unit';
import {Logo} from '@components/logo/logo';
import {Image, ImageType} from '@components/image/image';
import {IconButton} from '@components/icon_button/icon_button';
import {Button, ButtonType} from '@components/button/button';
import menuIcon from '@icon/menu.svg';
import store from '@app/store';
import {IObserver} from '@flux/types/observer';
import routing from '@actions/handlers/routing';
import {PayloadUser} from '@actions/types/user';
import {logout} from '@actions/handlers/user';
import {Subscription} from '@actions/types/subscribe';
import {openProfileEditor} from '@actions/handlers/editor';
import {RouteType} from '@actions/types/routing';


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
  {
    icon: menuIcon,
    text: 'Подписки',
    link: '/subsriptions',
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
export class LeftNavbar implements IObserver {
  /**
   * Актуальный контейнер левого навбара
   */
  readonly element: HTMLElement;

  private subsList: HTMLElement;
  private profile: HTMLElement;
  private user: PayloadUser | undefined;
  private subs: Subscription[] = [];
  private navbarUnits: NavbarUnit[] = [];
  /**
   * Конструктор
   */
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('left-navbar');
    const glass = new Glass(GlassType.mono);
    glass.element.classList.add('left-navbar__glass');
    this.element.appendChild(glass.element);
    const logo = new Logo();
    logo.element.classList.add('left-navbar__logo');
    const linkes = document.createElement('div');
    links.forEach(({icon, text, link}) => {
      const item =
          new NavbarUnit(icon, text, link, OrientType.left);
      linkes.appendChild(item.element);
      this.navbarUnits.push(item);
    });
    glass.element.appendChild(logo.element);
    glass.element.appendChild(linkes);
    glass.element.innerHTML += '<hr>';
    this.subsList = document.createElement('div');
    this.subsList.classList.add('left-navbar__subs-list');
    glass.element.appendChild(this.subsList);
    const profileContainer = document.createElement('div');
    profileContainer.classList.add('left-navbar__down');
    profileContainer.innerHTML += '<hr>';
    this.profile = document.createElement('div');
    this.profile.classList.add('left-navbar__down_profile');
    this.profile.addEventListener('click', () => {
      const user = store.getState().user as PayloadUser;
      routing(`/profile?id=${user.id}`, RouteType.STANDART);
    });
    const popup = new Glass(GlassType.lines);
    popup.element.style.display = 'none';
    profileContainer.appendChild(popup.element);
    const icnbtn = new IconButton(menuIcon, 'button');
    icnbtn.element.classList.add('left-navbar__down_btn');
    icnbtn.element.addEventListener('click', () => {
      if (popup.element.style.display == 'none') {
        popup.element.style.display = 'flex';
      } else {
        popup.element.style.display = 'none';
      }
    });
    popup.element.style.display = 'none';
    popup.element.classList.add('left-navbar__down_popup');
    const profileLink = new Button(ButtonType.outline, 'Профиль', 'button');
    profileLink.element.classList.add('left-navbar__down_popup_btn');
    profileLink.element.addEventListener('click', () => {
      const user = store.getState().user as PayloadUser;
      routing(`/profile?id=${user.id}`, RouteType.STANDART);
    });
    const change = new Button(ButtonType.outline, 'Изменить данные', 'button');
    change.element.classList.add('left-navbar__down_popup_btn');
    change.element.addEventListener('click',
        () => {
          openProfileEditor();
        });
    const logoutBtn = new Button(ButtonType.outline, 'Выйти', 'button');
    logoutBtn.element.classList.add('left-navbar__down_popup_btn');
    logoutBtn.element.addEventListener('click', () => {
      logout();
    });
    popup.element.appendChild(profileLink.element);
    popup.element.appendChild(change.element);
    popup.element.appendChild(logoutBtn.element);
    profileContainer.appendChild(icnbtn.element);
    profileContainer.appendChild(this.profile);
    glass.element.appendChild(profileContainer);
    store.registerObserver(this);
    this.renderLocation(ChoosenLink.FEED);
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
      const avatar = new Image(ImageType.sub, subItem.img);
      avatar.element.classList.add('left-navbar__sub_avatar');
      const usrname = document.createElement('span');
      usrname.innerText = subItem.title;
      sub.appendChild(avatar.element);
      sub.appendChild(usrname);
      this.subsList.appendChild(sub);
    });
  }

  /**
   * рендер профиля
   */
  renderProfile() {
    if (!this.user) {
      return;
    }
    this.profile.innerHTML = '';
    const avatar = new Image(
      this.user.isAuthor ? ImageType.author : ImageType.donater,
      this.user.avatar,
    );
    avatar.element.classList.add('left-navbar__down_profile_img');
    const usrname = document.createElement('span');
    usrname.innerText = this.user.username;
    this.profile.prepend(avatar.element, usrname);
  }

  /**
   * рендер выбора локации
   * @param page -
   */
  renderLocation(page: ChoosenLink) {
    switch (page) {
      case ChoosenLink.FEED:
        this.navbarUnits[0].element.classList.add('navbar-unit__choosen');
        this.navbarUnits[1].element.classList.remove('navbar-unit__choosen');
        this.navbarUnits[2].element.classList.remove('navbar-unit__choosen');
        break;
      case ChoosenLink.SEARCH:
        this.navbarUnits[0].element.classList.remove('navbar-unit__choosen');
        this.navbarUnits[1].element.classList.add('navbar-unit__choosen');
        this.navbarUnits[2].element.classList.remove('navbar-unit__choosen');
        break;
      case ChoosenLink.SUBSCRIBTIONS:
        this.navbarUnits[0].element.classList.remove('navbar-unit__choosen');
        this.navbarUnits[1].element.classList.remove('navbar-unit__choosen');
        this.navbarUnits[2].element.classList.add('navbar-unit__choosen');
        break;
      default:
        this.navbarUnits[0].element.classList.remove('navbar-unit__choosen');
        this.navbarUnits[1].element.classList.remove('navbar-unit__choosen');
        this.navbarUnits[2].element.classList.remove('navbar-unit__choosen');
        break;
    }
  }
  /** функция скрывающая navbar */
  hideNavbar() {
    this.element.style.display = 'none';
  }
  /** функция показывающая navbar */
  showNavbar() {
    this.element.removeAttribute('style');
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
}
