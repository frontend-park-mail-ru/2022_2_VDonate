import store from '@app/store';
import {IView} from '@flux/types/view';
import {IObserver} from '@flux/types/observer';
import {ProfileModel} from '@models/profileModel/profileModel';
import {PayloadUser} from '@actions/types/user';
import getProfile from '@actions/handlers/getProfileData';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import {PayloadAuthorSubscription,
  PayloadSubscribe} from '@actions/types/subscribe';

/** Реализация интерфейса *IView* для страницы профиля */
export default class ProfilePage implements IView, IObserver {
  /** Структорное представление страницы из компонентов */
  private element: ProfileModel;
  private profile: PayloadGetProfileData | undefined;
  private authorSubscription: PayloadAuthorSubscription | undefined;
  private authorSubscriptionID: number | undefined;
  private locId: string | null;
  /** Конструктор */
  constructor() {
    const user = store.getState().user as PayloadUser;
    this.locId = new URL(location.href).searchParams.get('id');
    this.element = new ProfileModel(
        user.id.toString() == this.locId,
    );
    store.registerObserver(this);
    getProfile(Number(new URL(location.href).searchParams.get('id')));
  }
  /** Оповещение об изменением хранилища */
  notify(): void {
    const profileNew = store.getState().profile as PayloadGetProfileData;
    if (JSON.stringify(profileNew) != JSON.stringify(this.profile)) {
      if (profileNew.user.isAuthor !== this.profile?.user.isAuthor) {
        this.element.setType(profileNew.user.isAuthor);
      }
      if (
        profileNew.authorSubscriptions !== this.profile?.authorSubscriptions) {
        if (typeof profileNew.authorSubscriptions == 'string') {
          console.warn(profileNew.authorSubscriptions);
        } else {
          this.element.renderSubContainer(profileNew.authorSubscriptions);
        }
      }
      if (profileNew.user.about !== this.profile?.user.about) {
        this.element.renderAbout(profileNew.user.about);
      }
      if (profileNew.subscriptions !== this.profile?.subscriptions) {
        if (typeof profileNew.subscriptions == 'string') {
          console.warn(profileNew.subscriptions);
        } else {
          this.element.renderSubscriptions(profileNew.subscriptions ?? []);
        }
      }
      if (profileNew.user !== this.profile?.user) {
        this.element.renderNavbar(profileNew.user);
      }
      this.profile = profileNew;
    }

    const newAuthorSubscription =
      store.getState().authorSubscriptionChange as {
        subscription?: PayloadAuthorSubscription
      } | undefined;
    if (newAuthorSubscription?.subscription &&
        newAuthorSubscription.subscription != this.authorSubscription) {
      this.authorSubscription = newAuthorSubscription.subscription;
      this.element.renderAuthorSubscription(newAuthorSubscription.subscription);
    }

    const newSubscribe =
      store.getState().subscribe as PayloadSubscribe | undefined;
    if (newSubscribe?.authorSubscriptionID) {
      this.authorSubscriptionID = newSubscribe.authorSubscriptionID;
      this.element.renderSubscribe(this.authorSubscriptionID,
          Number(this.locId));
    }
  }
  /** Сброс страницы, отключение от хранилища */
  reset(): void {
    store.removeObserver(this);
    this.element.element.remove();
  }
  /**
   * Создание страницы профиля
   * @returns Страница-элемент
   */
  render(): HTMLElement {
    this.element.renderAbout(undefined);
    this.element.renderSubContainer(undefined);
    return this.element.element;
  }
}
