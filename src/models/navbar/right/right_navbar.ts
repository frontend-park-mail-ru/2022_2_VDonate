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

  private avatar: string | undefined;
  private username: string | undefined;
  private countSubscribers: number | undefined;
  private countSubscriptions: number | undefined;
  /**
   * Конструктор
   */
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('right-navbar');
    this.glass = new Glass(GlassType.mono).element;
    this.glass.classList.add('right-navbar__glass');
    this.glass.classList.add('right-navbar__profile');
    const avatar = document.createElement('div');
    avatar.classList.add('right-navbar__profile_img');
    const usrname = document.createElement('span');
    usrname.classList.add('right-navbar__profile_username');
    const info = document.createElement('div');
    info.classList.add('right-navbar__profile_info');
    this.glass.append(avatar, usrname, info);
    this.element.appendChild(this.glass);
  }

  /**
   * @param user данные пользователя
   */
  render(user: PayloadProfileUser) {
    if (user.avatar != this.avatar) {
      const avatarEl =
        document.getElementsByClassName('right-navbar__profile_img');
      const avatar = new Image(
          user.isAuthor ? ImageType.author : ImageType.donater,
          user.avatar,
      );
      avatar.element.classList.add('right-navbar__profile_img');
      this.glass.replaceChild(avatar.element, avatarEl[0]);
    }
    if (user.username != this.username) {
      document.getElementsByClassName('right-navbar__profile_username')[0]
          .innerHTML = user.username;
      this.username = user.username;
    }
    if (user.countSubscriptions != this.countSubscriptions ||
        user.countSubscribers != this.countSubscribers) {
      const info =
        document.getElementsByClassName('right-navbar__profile_info');
      info[0].innerHTML = '';
      if (user.isAuthor) {
        const donatersContainer = document.createElement('div');
        donatersContainer.classList.add('right-navbar__profile_info_container');
        const donaters = document.createElement('span');
        donaters.classList.add('right-navbar__profile_info_donaters');
        donaters.innerText = 'Донатеров';
        const donatersCount = document.createElement('span');
        donatersCount.classList.add('right-navbar__profile_info_count');
        if (user.countSubscribers) {
          donatersCount.innerText = user.countSubscribers.toString();
          this.countSubscribers = user.countSubscribers;
        } else {
          donatersCount.innerText = '0';
        }
        donatersContainer.appendChild(donaters);
        donatersContainer.appendChild(donatersCount);
        info[0].appendChild(donatersContainer);
      }
      const subsContainer = document.createElement('div');
      subsContainer.classList.add('right-navbar__profile_info_container');
      const subs = document.createElement('span');
      subs.classList.add('right-navbar__profile_info_subs');
      subs.innerText = 'Подписок';
      const subsCount = document.createElement('span');
      subsCount.classList.add('right-navbar__profile_info_count');
      subsCount.innerText = user.countSubscriptions.toString();
      this.countSubscriptions = user.countSubscriptions;
      subsContainer.appendChild(subs);
      subsContainer.appendChild(subsCount);
      info[0].appendChild(subsContainer);
      this.glass.appendChild(info[0]);
    }
  }
}
