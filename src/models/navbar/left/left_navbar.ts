import './left_navbar.styl';
import {Glass, GlassType} from '@components/glass/glass';
import {NavbarUnit, OrientType} from '@components/navbar_unit/navbar_unit';
import {Logo} from '@components/logo/logo';
import {Image, ImageType} from '@components/image/image';

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
   */
  constructor(
      links: Link[],
      subs: Sub[],
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
  }
}
