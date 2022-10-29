import './right_navbar.styl';
import {Glass, GlassType} from '@components/glass/glass';
import {NavbarUnit, OrientType} from '@components/navbar_unit/navbar_unit';
import icon from '@icon/menu.svg';
import {Image, ImageType} from '@components/image/image';

export enum NavbarType {
  feed,
  profile,
}

interface ProfileNavbar {
  img: string,
  username: string,
  subscriptions: string,
  is_author: boolean,
  subscribers: string,
}

/**
 * Модель правого навбара
 */
export class RightNavbar {
  /**
   * Актуальный контейнер правого навбара
   */
  readonly element : HTMLElement;

  /**
   * @param navbarType вид правого навбара
   * @param data данные для для генерации правого навбара
   */
  constructor(navbarType: NavbarType, data: ProfileNavbar) {
    const glass = new Glass(GlassType.mono);
    this.element = glass.element;
    this.element.classList.remove('glass');
    switch (navbarType) {
      case NavbarType.feed:
        this.element.classList.add('right-navbar__feed');
        this.feedConstruct();
        break;
      case NavbarType.profile:
        this.element.classList.add('right-navbar__profile');
        data.is_author? this.authorConstruct(data): this.donaterConstruct(data);
        break;
      default:
        break;
    }
  }

  /**
   * конструктор для ленты
   */
  feedConstruct() {
    let item =
        new NavbarUnit(icon, 'Все публикации', false, '/', OrientType.right);
    this.element.appendChild(item.element);
    item = new NavbarUnit(icon, 'Доступные', false, '/', OrientType.right);
    this.element.appendChild(item.element);
    item = new NavbarUnit(icon, 'Понравилось', true, '/', OrientType.right);
    this.element.appendChild(item.element);
  }

  /**
   * Конструктор для автора
   * @param data данные для для генерации правого навбара
   */
  authorConstruct(data: ProfileNavbar) {
    const avatar = new Image(
        ImageType.author,
        '200px',
        data.img,
    );
    const usrname = document.createElement('span');
    usrname.classList.add('right-navbar__profile_username');
    usrname.innerText = data.username;
    const info = document.createElement('div');
    info.classList.add('right-navbar__profile_info');
    const donatersContainer = document.createElement('div');
    donatersContainer.classList.add('right-navbar__profile_info_container');
    const donaters = document.createElement('span');
    donaters.classList.add('right-navbar__profile_info_donaters');
    donaters.innerText = 'Донатеров';
    const donatersCount = document.createElement('span');
    donatersCount.classList.add('right-navbar__profile_info_count');
    donatersCount.innerText = data.subscribers;
    donatersContainer.appendChild(donaters);
    donatersContainer.appendChild(donatersCount);
    const subsContainer = document.createElement('div');
    subsContainer.classList.add('right-navbar__profile_info_container');
    const subs = document.createElement('span');
    subs.classList.add('right-navbar__profile_info_subs');
    subs.innerText = 'Подписок';
    const subsCount = document.createElement('span');
    subsCount.classList.add('right-navbar__profile_info_count');
    subsCount.innerText = data.subscriptions;
    subsContainer.appendChild(subs);
    subsContainer.appendChild(subsCount);
    info.appendChild(donatersContainer);
    info.appendChild(subsContainer);
    this.element.appendChild(avatar.element);
    this.element.appendChild(usrname);
    this.element.appendChild(info);
  }

  /**
   * Конструктор для донатера
   * @param data данные для для генерации правого навбара
   */
  donaterConstruct(data: ProfileNavbar) {
    const avatar = new Image(
        ImageType.donater,
        '200px',
        data.img,
    );
    const usrname = document.createElement('span');
    usrname.classList.add('right-navbar__profile_username');
    usrname.innerText = data.username;
    const info = document.createElement('div');
    info.classList.add('right-navbar__profile_info');
    const subsContainer = document.createElement('div');
    subsContainer.classList.add('right-navbar__profile_info_container');
    const subs = document.createElement('span');
    subs.classList.add('right-navbar__profile_info_subs');
    subs.innerText = 'Подписок';
    const subsCount = document.createElement('span');
    subsCount.classList.add('right-navbar__profile_info_count');
    subsCount.innerText = data.subscriptions;
    subsContainer.appendChild(subs);
    subsContainer.appendChild(subsCount);
    info.appendChild(subsContainer);
    this.element.appendChild(avatar.element);
    this.element.appendChild(usrname);
    this.element.appendChild(info);
  }
}
