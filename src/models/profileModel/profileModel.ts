import {
  PayloadAuthorSubscription,
  PayloadProfileSubscription,
  PayloadProfileUser} from '@actions/types/getProfileData';
import {Glass, GlassType} from '@components/glass/glass';
import {SubscriptionItem} from '@components/subscriptionItem/subscriptionItem';
import {About} from '@models/about/about';
import {RightNavbar} from '@models/navbar/right/right_navbar';
import {SubContainer} from '@models/subContainer/subContainer';
import './profileModel.styl';

/**
 * Модель Профиля
 */
export class ProfileModel {
  /**
   * Актуальный контейнер
   */
  readonly element: HTMLElement;

  private subContainer: SubContainer;
  private about: About;
  private head: HTMLElement;
  private glass: Glass;
  private rightNavbar: RightNavbar;
  /**
   * конструктор
   * @param changeable флаг возможности изменять данные
  */
  constructor(changeable: boolean) {
    this.element = document.createElement('div');
    this.element.classList.add('content');
    this.rightNavbar = new RightNavbar();
    this.subContainer = new SubContainer(changeable);
    this.about = new About(changeable);
    this.head = document.createElement('div');
    this.head.classList.add('content__head');
    this.head.innerText = 'Подписки';
    this.glass = new Glass(GlassType.mono);
    this.glass.element.classList.add('content__glass');
    this.element.appendChild(this.rightNavbar.element);
  }

  /**
   * @param isAuthor является ли автором
   */
  setType(isAuthor: boolean) {
    this.element.innerHTML = '';
    if (isAuthor) {
      this.element.append(this.subContainer.element, this.about.element);
    } else {
      this.element.append(this.head, this.glass.element);
    }
    this.element.appendChild(this.rightNavbar.element);
  }
  /**
   * @param subscriptions список подписок пользователя
   */
  renderSubscriptions(subscriptions: PayloadProfileSubscription[]) {
    this.glass.element.innerHTML = '';
    subscriptions.forEach((sub) => {
      const subItem = new SubscriptionItem(
          // TODO раскоменитить если есть id автора
          1, // sub.author.id,
          sub.author.avatar,
          sub.author.username,
          sub.tier,
      );
      this.glass.element.appendChild(subItem.element);
    });
  }
  /**
   * @param subs Уровни подписок автора
   */
  renderSubContainer(subs: PayloadAuthorSubscription[] | undefined) {
    this.subContainer.renderSubs(subs);
  }

  /**
   * @param about новый текст об пользователе
   */
  renderAbout(about: string | undefined) {
    this.about.setText(about);
  }

  /**
   * @param user данные профиля
   */
  renderNavbar(user: PayloadProfileUser) {
    user.isAuthor ? this.rightNavbar.authorRender(user) :
      this.rightNavbar.donaterRender(user);
  }
}
