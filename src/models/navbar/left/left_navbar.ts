import './left_navbar.styl';
import {Glass, GlassType} from '@components/glass/glass';
import {NavbarUnit, OrientType} from '@components/navbar_unit/navbar_unit';
import {Logo} from '@components/logo/logo';
import {Image, ImageType} from '@components/image/image';
import {IconButton} from '@components/icon_button/icon_button';
import {Popup} from '../../popup/left_navbar/popup';
import {Button, ButtonType} from '@components/button/button';
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
    this.element = document.createElement('div');
    this.element.classList.add('left-navbar');
    const glass = new Glass(GlassType.mono);
    glass.element.classList.add('left-navbar__glass');
    this.element.appendChild(glass.element);
    const logo = new Logo();
    logo.element.classList.add('left-navbar__logo');
    const linkes = document.createElement('div');
    links.forEach(({icon, text, choosen, href}) => {
      const item =
          new NavbarUnit(icon, text, choosen, href, OrientType.left);
      linkes.appendChild(item.element);
    });
    glass.element.appendChild(logo.element);
    glass.element.appendChild(linkes);
    glass.element.innerHTML += '<hr>';
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
    glass.element.appendChild(subsList);
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
    popup.element.style.display ='none';
    popup.element.classList.add('left-navbar__down_popup');
    const profileLink = new Button(ButtonType.outline, 'Профиль', 'button');
    profileLink.element.classList.add('left-navbar__down_popup_btn');
    profileLink.element.onclick = () => {
      // TODO: переход на профиль
    };
    const change = new Button(ButtonType.outline, 'Изменить данные', 'button');
    change.element.classList.add('left-navbar__down_popup_btn');
    const popupEdit = new Popup(() => {
      // TODO: функция валидации и отправки на сервер
      return true;
    });
    change.element.onclick = () => {
      popupEdit.element.style.display = 'flex';
    };
    document.getElementById('entry')?.appendChild(popupEdit.element);
    const logout = new Button(ButtonType.outline, 'Выйти', 'button');
    logout.element.classList.add('left-navbar__down_popup_btn');
    logout.element.onclick = () => {
      // TODO: вызов выхода
    };
    popup.element.appendChild(profileLink.element);
    popup.element.appendChild(change.element);
    popup.element.appendChild(logout.element);
    profile.appendChild(icnbtn.element);
    profileContainer.appendChild(profile);
    glass.element.appendChild(profileContainer);
  }
}
