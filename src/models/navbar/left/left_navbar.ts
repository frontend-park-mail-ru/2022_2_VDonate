import './left_navbar.styl';
import {Glass, GlassType} from '@components/glass/glass';
import {NavbarUnit, OrientType} from '@components/navbar_unit/navbar_unit';
import {Logo} from '@components/logo/logo';
import {Image, ImageType} from '@components/image/image';
import {IconButton} from '@components/icon_button/icon_button';
import menuIcon from '@icon/menu.svg';

interface Link {
    icon: string,
    text: string,
    choosen: boolean,
    href: string,
}

interface Sub {
  img: string,
  username: string,
  id: string,
}

interface Profile {
  img: string,
  username: string,
  id: string,
  is_author: boolean,
}

/**
 * Модель левого навбара
 */
export class LeftNavbar {
  /**
   * Актуальный контейнер левого навбара
   */
  readonly element : HTMLElement;

  /**
   * @param links ссылки
   * @param subs подписки
   * @param profileData линый профиль
   */
  constructor(
      links: Link[],
      subs: Sub[],
      profileData: Profile,
  ) {
    const glass = new Glass(GlassType.mono);
    this.element = glass.element;
    this.element.classList.remove('glass');
    this.element.classList.add('left-navbar');
    const logo = new Logo();
    logo.element.classList.add('left-navbar__logo');
    const linkes = document.createElement('div');
    links.forEach(({icon, text, choosen, href}) => {
      const item =
          new NavbarUnit(icon, text, choosen, href, OrientType.left);
      linkes.appendChild(item.element);
    });
    this.element.appendChild(logo.element);
    this.element.appendChild(linkes);
    this.element.innerHTML += '<hr>';
    const subsList = document.createElement('div');
    subsList.classList.add('left-navbar__subs-list');
    subs.forEach(({img, username, id}) => {
      const sub = document.createElement('a');
      sub.setAttribute('href', `/profile?id=${id}`);
      sub.setAttribute('data-link', '');
      sub.classList.add('left-navbar__sub');
      const avatar = new Image(ImageType.author, '30px', img);
      const usrname = document.createElement('span');
      usrname.innerText = username;
      sub.appendChild(avatar.element);
      sub.appendChild(usrname);
      subsList.appendChild(sub);
    });
    this.element.appendChild(subsList);
    const profileContainer = document.createElement('div');
    profileContainer.classList.add('left-navbar__down');
    profileContainer.innerHTML += '<hr>';
    const profile = document.createElement('div');
    profile.classList.add('left-navbar__down_profile');
    const avatar = new Image(
      profileData.is_author? ImageType.author : ImageType.donater,
      '50px',
      profileData.img,
    );
    const usrname = document.createElement('span');
    usrname.innerText = profileData.username;
    profile.appendChild(avatar.element);
    profile.appendChild(usrname);
    const icnbtn = new IconButton(menuIcon, 'submit');
    icnbtn.element.classList.add('left-navbar__down_btn');
    profile.appendChild(icnbtn.element);
    profileContainer.appendChild(profile);
    this.element.appendChild(profileContainer);
  }
}
