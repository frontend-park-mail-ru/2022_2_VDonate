import getProfileData from '@actions/handlers/getProfileData';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import store from '@app/store';
import {Glass, GlassType} from '@components/glass/glass';
import {SubscriptionItem} from '@components/subscriptionItem/subscriptionItem';
import {About} from '@models/about/about';
import {RightNavbar} from '@models/navbar/right/right_navbar';
import {SubContainer} from '@models/subContainer/subContainer';
import './profileModel.styl';
import {IObserver} from '@flux/types/observer';

/**
 * Модель поля подписок
 */
export class ProfileModel implements IObserver {
  /**
   * Актуальный контейнер
   */
  readonly element: HTMLElement;

  private changeable: boolean;
  private isAuthor: boolean | undefined;
  private subContainer: SubContainer | undefined;
  private about: About | undefined;
  private head: HTMLElement | undefined;
  private glass: Glass | undefined;
  private subscriptions: PayloadGetProfileData['subscriptions'] | undefined;
  private rightNavbar: RightNavbar;
  /**
   * конструктор
   * @param changeable флаг возможности изменять данные
  */
  constructor(changeable: boolean) {
    this.changeable = changeable;
    this.element = document.createElement('div');
    this.element.classList.add('content');
    const profile = store.getState().profile as PayloadGetProfileData;
    this.isAuthor = profile.profile?.isAuthor;
    if (this.isAuthor) {
      this.subContainer = new SubContainer(changeable);
      this.about = new About(changeable);
      this.element.appendChild(this.subContainer.element);
      this.element.appendChild(this.about.element);
    } else {
      this.head = document.createElement('div');
      this.head.classList.add('content__head');
      this.head.innerText = 'Подписки';
      this.glass = new Glass(GlassType.mono);
      this.glass.element.classList.add('content__glass');
      this.subscriptions = profile.subscriptions;
      this.subscriptions?.forEach((sub) => {
        const subItem = new SubscriptionItem(
            1, // TODO id вставить
            sub.img,
            sub.title,
            sub.tier,
        );
        this.glass?.element.appendChild(subItem.element);
      });
      this.element.appendChild(this.head);
      this.element.appendChild(this.glass.element);
    }
    this.rightNavbar = new RightNavbar();
    this.element.appendChild(this.rightNavbar.element);
    store.registerObserver(this);
    getProfileData(Number(new URL(location.href).searchParams.get('id')));
  }

  /** Callback метод обновления хранилища */
  notify(): void {
    const profile = store.getState().profile as PayloadGetProfileData;
    if (!profile.profile) {
      return;
    }
    if (profile.profile.isAuthor != this.isAuthor) {
      this.isAuthor = profile.profile.isAuthor;
      this.element.innerHTML = '';
      if (this.isAuthor) {
        this.head = undefined;
        this.glass = undefined;
        this.subContainer = new SubContainer(this.changeable);
        this.about = new About(this.changeable);
        this.element.appendChild(this.subContainer.element);
        this.element.appendChild(this.about.element);
      } else {
        this.subContainer = undefined;
        this.about = undefined;
        this.head = document.createElement('div');
        this.head.classList.add('content__head');
        this.head.innerText = 'Подписки';
        this.glass = new Glass(GlassType.mono);
        this.glass.element.classList.add('content__glass');
        this.subscriptions = profile.subscriptions;
        this.subscriptions?.forEach((sub) => {
          const subItem = new SubscriptionItem(
              1, // TODO id вставить
              sub.img,
              sub.title,
              sub.tier,
          );
          this.glass?.element.appendChild(subItem.element);
        });
      }
      this.element.appendChild(this.rightNavbar.element);
    }
  }
}
