import './right_navbar.styl';
import {Glass, GlassType} from '@components/glass/glass';
import {Image, ImageType} from '@components/image/image';
import {
  PayloadProfileUser} from '@actions/types/getProfileData';

/**
 * Модель правого навбара
 */
export class RightNavbar {
  /**
   * Актуальный контейнер правого навбара
   */
  readonly element: HTMLElement;

  private glass: HTMLElement;
  /**
   * Конструктор
   */
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('right-navbar');
    this.glass = new Glass(GlassType.mono).element;
    this.glass.classList.add('right-navbar__glass');
    this.glass.classList.add('right-navbar__profile');
    this.element.appendChild(this.glass);
  }

  /**
   * @param user данные пользователя
   */
  authorRender(user: PayloadProfileUser) {
    this.glass.innerHTML = '';

    const avatar = new Image(
        ImageType.author,
        user.avatar,
    );
    avatar.element.classList.add('right-navbar__profile_img');
    const usrname = document.createElement('span');
    usrname.classList.add('right-navbar__profile_username');
    usrname.innerText = user.username;
    const info = document.createElement('div');
    info.classList.add('right-navbar__profile_info');
    const donatersContainer = document.createElement('div');
    donatersContainer.classList.add('right-navbar__profile_info_container');
    const donaters = document.createElement('span');
    donaters.classList.add('right-navbar__profile_info_donaters');
    donaters.innerText = 'Донатеров';
    const donatersCount = document.createElement('span');
    donatersCount.classList.add('right-navbar__profile_info_count');
    if (user.countSubscribers) {
      donatersCount.innerText = user.countSubscribers.toString();
    } else {
      donatersCount.innerText = '0';
    }
    donatersContainer.appendChild(donaters);
    donatersContainer.appendChild(donatersCount);
    const subsContainer = document.createElement('div');
    subsContainer.classList.add('right-navbar__profile_info_container');
    const subs = document.createElement('span');
    subs.classList.add('right-navbar__profile_info_subs');
    subs.innerText = 'Подписок';
    const subsCount = document.createElement('span');
    subsCount.classList.add('right-navbar__profile_info_count');
    subsCount.innerText = user.countSubscriptions.toString();
    subsContainer.appendChild(subs);
    subsContainer.appendChild(subsCount);
    info.appendChild(donatersContainer);
    info.appendChild(subsContainer);
    this.glass.appendChild(avatar.element);
    this.glass.appendChild(usrname);
    this.glass.appendChild(info);
  }

  /**
   * @param user данные пользователя
   */
  donaterRender(user: PayloadProfileUser) {
    this.glass.innerHTML = '';
    const avatar = new Image(
        ImageType.donater,
        user.avatar,
    );
    avatar.element.classList.add('right-navbar__profile_img');
    const usrname = document.createElement('span');
    usrname.classList.add('right-navbar__profile_username');
    usrname.innerText = user.username;
    const info = document.createElement('div');
    info.classList.add('right-navbar__profile_info');
    const subsContainer = document.createElement('div');
    subsContainer.classList.add('right-navbar__profile_info_container');
    const subs = document.createElement('span');
    subs.classList.add('right-navbar__profile_info_subs');
    subs.innerText = 'Подписок';
    const subsCount = document.createElement('span');
    subsCount.classList.add('right-navbar__profile_info_count');
    subsCount.innerText = user.countSubscriptions.toString();
    subsContainer.appendChild(subs);
    subsContainer.appendChild(subsCount);
    info.appendChild(subsContainer);
    this.glass.appendChild(avatar.element);
    this.glass.appendChild(usrname);
    this.glass.appendChild(info);
  }
}
