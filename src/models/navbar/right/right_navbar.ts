import './right_navbar.styl';
import {Glass, GlassType} from '@components/glass/glass';
import {Image, ImageType} from '@components/image/image';
import store from '@app/store';
import {IObserver} from '@flux/types/observer';
import {PayloadGetProfileData} from '@actions/types/getProfileData';

interface Profile {
  avatar: string,
  is_author: boolean,
  username: string,
  subscriptionsCount: number,
  subscribersCount: number,
}
/**
 * Модель правого навбара
 */
export class RightNavbar implements IObserver {
  /**
   * Актуальный контейнер правого навбара
   */
  readonly element: HTMLElement;

  private glass: HTMLElement;
  private profile: Profile | undefined;
  /**
   * Конструктор
   */
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('right-navbar');
    this.glass = new Glass(GlassType.mono).element;
    this.glass.classList.add('right-navbar__glass');
    this.element.appendChild(this.glass);
    store.registerObserver(this);
  }

  /**
   * Конструктор для автора
   */
  authorConstruct() {
    this.glass.classList.add('right-navbar__profile');
    if (!this.profile) {
      return;
    }
    const avatar = new Image(
        ImageType.author,
        this.profile.avatar,
    );
    avatar.element.classList.add('right-navbar__img');
    const usrname = document.createElement('span');
    usrname.classList.add('right-navbar__profile_username');
    usrname.innerText = this.profile.username;
    const info = document.createElement('div');
    info.classList.add('right-navbar__profile_info');
    const donatersContainer = document.createElement('div');
    donatersContainer.classList.add('right-navbar__profile_info_container');
    const donaters = document.createElement('span');
    donaters.classList.add('right-navbar__profile_info_donaters');
    donaters.innerText = 'Донатеров';
    const donatersCount = document.createElement('span');
    donatersCount.classList.add('right-navbar__profile_info_count');
    donatersCount.innerText = this.profile.subscribersCount.toString();
    donatersContainer.appendChild(donaters);
    donatersContainer.appendChild(donatersCount);
    const subsContainer = document.createElement('div');
    subsContainer.classList.add('right-navbar__profile_info_container');
    const subs = document.createElement('span');
    subs.classList.add('right-navbar__profile_info_subs');
    subs.innerText = 'Подписок';
    const subsCount = document.createElement('span');
    subsCount.classList.add('right-navbar__profile_info_count');
    subsCount.innerText = this.profile.subscriptionsCount.toString();
    subsContainer.appendChild(subs);
    subsContainer.appendChild(subsCount);
    info.appendChild(donatersContainer);
    info.appendChild(subsContainer);
    this.glass.appendChild(avatar.element);
    this.glass.appendChild(usrname);
    this.glass.appendChild(info);
  }

  /**
   * Конструктор для донатера
   */
  donaterConstruct() {
    this.glass.classList.add('right-navbar__profile');
    if (!this.profile) {
      return;
    }
    const avatar = new Image(
        ImageType.donater,
        this.profile.avatar,
    );
    avatar.element.classList.add('right-navbar__img');
    const usrname = document.createElement('span');
    usrname.classList.add('right-navbar__profile_username');
    usrname.innerText = this.profile.username;
    const info = document.createElement('div');
    info.classList.add('right-navbar__profile_info');
    const subsContainer = document.createElement('div');
    subsContainer.classList.add('right-navbar__profile_info_container');
    const subs = document.createElement('span');
    subs.classList.add('right-navbar__profile_info_subs');
    subs.innerText = 'Подписок';
    const subsCount = document.createElement('span');
    subsCount.classList.add('right-navbar__profile_info_count');
    subsCount.innerText = this.profile.subscriptionsCount.toString();
    subsContainer.appendChild(subs);
    subsContainer.appendChild(subsCount);
    info.appendChild(subsContainer);
    this.glass.appendChild(avatar.element);
    this.glass.appendChild(usrname);
    this.glass.appendChild(info);
  }

  /** Callback метод обновления хранилища */
  notify(): void {
    const profileStore = store.getState().profile as PayloadGetProfileData;
    if (!profileStore.profile) {
      return;
    }
    const profileNew: Profile = {
      avatar: profileStore.profile.avatar,
      is_author: profileStore.profile.is_author,
      username: profileStore.profile.username,
      subscriptionsCount:
        profileStore.subscriptions ? profileStore.subscriptions.length : 0,
      subscribersCount:
        profileStore.subscribers ? profileStore.subscribers.length : 0,
    };
    if (JSON.stringify(profileNew) !== JSON.stringify(this.profile)) {
      this.profile = profileNew;
      if (this.profile.is_author) {
        this.authorConstruct();
      } else {
        this.donaterConstruct();
      }
    }
  }
}
