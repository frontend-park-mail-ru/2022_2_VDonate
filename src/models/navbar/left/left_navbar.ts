import './left_navbar.styl';
import {Glass, GlassType} from '@components/glass/glass';
import {NavbarUnit, OrientType} from '@components/navbar_unit/navbar_unit';
import {Logo} from '@components/logo/logo';
import {Image, ImageType} from '@components/image/image';
import {IconButton} from '@components/icon_button/icon_button';
import {Popup} from '../../popup/left_navbar/popup';
import {Button, ButtonType} from '@components/button/button';
import menuIcon from '@icon/menu.svg';
import store from '@app/store';
import {IObserver} from '@flux/types/observer';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import getProfile from '@actions/handlers/getProfileData';
import routing from '@actions/handlers/routing';
import {PayloadUser} from '@actions/types/user';


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
  private user: PayloadGetProfileData['profile'] | undefined;
  private subs: PayloadGetProfileData['subscriptions'] | undefined;
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
    const popup = new Glass(GlassType.lines);
    popup.element.style.display = 'none';
    profileContainer.appendChild(popup.element);
    const icnbtn = new IconButton(menuIcon, 'button');
    icnbtn.element.classList.add('left-navbar__down_btn');
    icnbtn.element.onclick = () => {
      if (popup.element.style.display == 'none') {
        popup.element.style.display = 'flex';
      } else {
        popup.element.style.display = 'none';
      }
    };
    popup.element.style.display = 'none';
    popup.element.classList.add('left-navbar__down_popup');
    const profileLink = new Button(ButtonType.outline, 'Профиль', 'button');
    profileLink.element.classList.add('left-navbar__down_popup_btn');
    profileLink.element.onclick = () => {
      const user = store.getState().user as PayloadUser;
      routing(`/profile?id=${user.id}`);
    };
    const change = new Button(ButtonType.outline, 'Изменить данные', 'button');
    change.element.classList.add('left-navbar__down_popup_btn');
    const popupEdit = new Popup();
    change.element.onclick = () => {
      popupEdit.element.style.display = 'flex';
    };
    document.body.appendChild(popupEdit.element);
    const logout = new Button(ButtonType.outline, 'Выйти', 'button');
    logout.element.classList.add('left-navbar__down_popup_btn');
    logout.element.onclick = () => {
      // TODO: вызов выхода
    };
    popup.element.appendChild(profileLink.element);
    popup.element.appendChild(change.element);
    popup.element.appendChild(logout.element);
    profileContainer.appendChild(icnbtn.element);
    profileContainer.appendChild(this.profile);
    glass.element.appendChild(profileContainer);
    store.registerObserver(this);
    this.renderLocation();
    getProfile(Number(new URL(location.href).searchParams.get('id')));
  }

  /**
   * рендер подписок
   */
  renderSubs() {
    this.subsList.innerHTML = '';
    this.subs?.forEach(({img, title}) => {
      const sub = document.createElement('a');
      // sub.setAttribute('href', `/profile?id=${id}`);
      // sub.setAttribute('data-link', '');
      sub.classList.add('left-navbar__sub');
      const avatar = new Image(ImageType.author, img);
      avatar.element.classList.add('left-navbar__sub_avatar');
      const usrname = document.createElement('span');
      usrname.innerText = title;
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
      this.user.is_author ? ImageType.author : ImageType.donater,
      this.user.avatar,
    );
    avatar.element.classList.add('left-navbar__down_profile_img');
    const usrname = document.createElement('span');
    usrname.innerText = this.user.username;
    this.profile.prepend(avatar.element, usrname);
  }

  /**
   * рендер выбора локации
   */
  renderLocation() {
    this.navbarUnits.forEach((navbarUnit: NavbarUnit) =>{
      navbarUnit.setSelect(
          navbarUnit.element.getAttribute('href') ==
          location.href,
      );
    });
  }
  /** функция скрывающая navbar */
  hideNavbar() {
    this.element.style.display = 'none';
  }
  /** функция показывающая navbar */
  showNavbar() {
    this.element.style.display = 'block';
  }
  /** Callback метод обновления хранилища */
  notify(): void {
    this.renderLocation();
    const newProfile =
    store.getState().profile as PayloadGetProfileData;
    if (JSON.stringify(newProfile.profile) !== JSON.stringify(this.user)) {
      this.user = newProfile.profile;
      this.renderProfile();
    }
    if (
      JSON.stringify(newProfile.subscriptions) !== JSON.stringify(this.subs)
    ) {
      this.subs = newProfile.subscriptions;
      this.renderSubs();
    }
  }
}
