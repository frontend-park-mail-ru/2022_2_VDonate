import store from '@app/store';
import {IView} from '@flux/types/view';
import {IObserver} from '@flux/types/observer';
import {ProfileModel} from '@models/profileModel/profileModel';
import {PayloadUser} from '@actions/types/user';
import getProfile from '@actions/handlers/getProfileData';
import {PayloadGetProfileData} from '@actions/types/getProfileData';

/** Реализация интерфейса *IView* для страницы профиля */
export default class ProfilePage implements IView, IObserver {
  /** Структорное представление страницы из компонентов */
  private components: ProfileModel;
  private profile: PayloadGetProfileData | undefined;
  /** Конструктор */
  constructor() {
    const user = store.getState().user as PayloadUser;
    const locId = new URL(location.href).searchParams.get('id');
    this.components = new ProfileModel(
        user.id.toString() == locId,
    );
    store.registerObserver(this);
    getProfile(Number(new URL(location.href).searchParams.get('id')));
  }
  /** Оповещение об изменением хранилища */
  notify(): void {
    this.rerender();
  }
  /** Сброс страницы, отключение от хранилища */
  reset(): void {
    store.removeObserver(this);
    this.components.element.remove();
  }
  /**
   * Создание страницы профиля
   * @returns Страница-элемент
   */
  render(): HTMLElement {
    this.components.renderAbout(undefined);
    this.components.renderSubContainer(undefined);
    return this.components.element;
  }
  /** Перерисовка страницы по текущему состоянию хранилища */
  rerender(): void {
    const profileNew = store.getState().profile as PayloadGetProfileData;
    if (JSON.stringify(profileNew) == JSON.stringify(this.profile)) {
      return;
    }
    if (profileNew.user.isAuthor !== this.profile?.user.isAuthor) {
      this.components.setType(profileNew.user.isAuthor);
    }
    if (profileNew.authorSubscriptions !== this.profile?.authorSubscriptions) {
      if (typeof profileNew.authorSubscriptions == 'string') {
        // TODO попап ошибки
        console.warn(profileNew.authorSubscriptions);
      } else {
        this.components.renderSubContainer(profileNew.authorSubscriptions);
      }
    }
    if (profileNew.user.about !== this.profile?.user.about) {
      this.components.renderAbout(profileNew.user.about);
    }
    if (profileNew.subscriptions !== this.profile?.subscriptions) {
      if (typeof profileNew.subscriptions == 'string') {
        // TODO попап ошибки
        console.warn(profileNew.subscriptions);
      } else {
        this.components.renderSubscriptions(profileNew.subscriptions ?? []);
      }
    }
    if (profileNew.user !== this.profile?.user) {
      this.components.renderNavbar(profileNew.user);
    }
    this.profile = profileNew;
  }
}
