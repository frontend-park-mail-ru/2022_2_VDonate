import {
  PayloadAuthorSubscription,
  PayloadProfileSubscription,
  PayloadProfileUser} from '@actions/types/getProfileData';
import {PayloadUser} from '@actions/types/user';
import store from '@app/store';
import {Glass, GlassType} from '@components/glass/glass';
import {SubscriptionItem} from '@components/subscriptionItem/subscriptionItem';
import {About} from '@models/about/about';
import {RightNavbar} from '@models/navbar/right/right_navbar';
import {SubContainer} from '@models/subContainer/subContainer';
import {PostsContaner} from '@views/containers/posts/posts';
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

  private postContaner: PostsContaner;
  /**
   * конструктор
   * @param changeable флаг возможности изменять данные
  */
  constructor(changeable: boolean) {
    this.element = document.createElement('div');
    this.element.classList.add('content');
    this.rightNavbar = new RightNavbar();
    this.subContainer = new SubContainer(changeable);
    this.about = new About();
    this.head = document.createElement('div');
    this.head.classList.add('content__head');
    this.head.innerText = 'Подписки';
    this.glass = new Glass(GlassType.mono);
    this.glass.element.classList.add('content__glass');
    this.element.appendChild(this.rightNavbar.element);

    const user = store.getState().user as PayloadUser;
    this.postContaner = new PostsContaner(changeable && user.isAuthor);
    // getPostsByAuthor({
    //   id: user.id,
    //   username: user.username,
    //   img: user.avatar,
    // });
  }

  /**
   * @param isAuthor является ли автором
   */
  setType(isAuthor: boolean) {
    this.element.innerHTML = '';
    if (isAuthor) {
      this.element.append(
          this.subContainer.element,
          this.about.element,
          this.postContaner.element,
      );
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
          sub.author.id,
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
