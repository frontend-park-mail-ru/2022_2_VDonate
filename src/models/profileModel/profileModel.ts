import getProfileData from '@actions/handlers/getProfileData';
import {PayloadAuth} from '@actions/types/auth';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import store from '@app/store';
import {Glass, GlassType} from '@components/glass/glass';
import {SubscriptionItem} from '@components/subscriptionItem/subscriptionItem';
import {About} from '@models/about/about';
import {RightNavbar} from '@models/navbar/right/right_navbar';
import {SubContainer} from '@models/subContainer/subContainer';
import './profileModel.styl';

/**
 * Модель поля подписок
 */
export class ProfileModel {
  /**
   * Актуальный контейнер
   */
  readonly element: HTMLElement;

  /** конструктор
  */
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('content');
    const user = store.getState().user as PayloadAuth;
    const profile = store.getState().profile as PayloadGetProfileData;
    const locId = new URL(location.href).searchParams.get('id');
    if (profile.profile?.is_author) {
      const subContainer = new SubContainer(
          user.id.toString() == locId,
      );
      const about = new About(
          user.id.toString() == locId,
      );
      this.element.appendChild(subContainer.element);
      this.element.appendChild(about.element);
    } else {
      const head = document.createElement('div');
      head.classList.add('content__head');
      head.innerText = 'Подписки';
      const glass = new Glass(GlassType.mono);
      glass.element.classList.add('content__glass');
      profile.subscriptions?.forEach((sub) => {
        const subItem = new SubscriptionItem(
            1, // TODO id вставить
            sub.img,
            sub.title,
            sub.tier,
        );
        glass.element.appendChild(subItem.element);
      });
      this.element.appendChild(head);
      this.element.appendChild(glass.element);
    }
    const rightNavbar = new RightNavbar();
    this.element.appendChild(rightNavbar.element);
    getProfileData(Number(new URL(location.href).searchParams.get('id')));
  }
}
