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
  readonly element: HTMLElement;

  /**
   * @param navbarType вид правого навбара
   * @param data данные для для генерации правого навбара
   */
  constructor(navbarType: NavbarType, data: ProfileNavbar) {
    this.element = document.createElement('div');
    this.element.classList.add('right-navbar');
    const glass = new Glass(GlassType.mono);
    glass.element.classList.add('right-navbar__glass');
    this.element.appendChild(glass.element);
    switch (navbarType) {
      case NavbarType.feed:
        glass.element.classList.add('right-navbar__feed');
        this.feedConstruct(glass.element);
        break;
      case NavbarType.profile:
        glass.element.classList.add('right-navbar__profile');
        data.is_author ?
          this.authorConstruct(glass.element, data) :
          this.donaterConstruct(glass.element, data);
        break;
      default:
        break;
    }
  }

  /**
   * конструктор для ленты
   * @param glass элемент стекла
   */
  feedConstruct(glass: HTMLElement) {
    let item =
        new NavbarUnit(icon, 'Все публикации', false, '/', OrientType.right);
    glass.appendChild(item.element);
    item = new NavbarUnit(icon, 'Доступные', false, '/', OrientType.right);
    glass.appendChild(item.element);
    item = new NavbarUnit(icon, 'Понравилось', true, '/', OrientType.right);
    glass.appendChild(item.element);
  }

  /**
   * Конструктор для автора
   * @param glass элемент стекла
   * @param data данные для для генерации правого навбара
   */
  authorConstruct(glass: HTMLElement, data: ProfileNavbar) {
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
    glass.appendChild(avatar.element);
    glass.appendChild(usrname);
    glass.appendChild(info);
  }

  /**
   * Конструктор для донатера
   * @param glass элемент стекла
   * @param data данные для для генерации правого навбара
   */
  donaterConstruct(glass: HTMLElement, data: ProfileNavbar) {
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
    glass.appendChild(avatar.element);
    glass.appendChild(usrname);
    glass.appendChild(info);
  }
}
