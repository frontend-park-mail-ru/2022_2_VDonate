import store from '@app/Store';
import {PayloadUser} from '@actions/types/user';
import getProfile from '@actions/handlers/getProfileData';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import About from '@components/About/About';
import ProfileInfo from '@views/containers/ProfileInfo/ProfileInfo';
import PostsContainer from '@views/containers/PostsContainer/PostsContainer';
import SubscriptionLink from '@components/SubscriptionLink/SubscriptionLink';
import './profile-page.styl';
import SubscriptionCardsContainer
  from
  '@views/containers/SubscriptionCardsContainer/SubscriptionCardsContainer';
import UpgradeViewBase from '@app/UpgradeView';
import {querySelectorWithThrow} from '@flux/types/component';
import Button, {ButtonType} from '@components/Button/Button';
import routing from '@actions/handlers/routing';

interface ProfileEditorOptions {
  profileID: number
  changeable: boolean
}

interface ProfilePageChildViews {
  postContainer?: PostsContainer
  subscriptionCardsContainer?: SubscriptionCardsContainer
  profileInfo?: ProfileInfo
}

export default class ProfilePage extends UpgradeViewBase {
  private isAuthor: boolean | undefined;
  private subscriptions: HTMLDivElement = document.createElement('div');
  private childViews: ProfilePageChildViews = {};
  private about!: About;

  constructor(el: HTMLElement, private options: ProfileEditorOptions) {
    super();
    this.renderTo(el);
    getProfile(this.options.profileID);
  }

  /** Оповещение об изменением хранилища */
  notify(): void {
    const profileNew =
      store.getState().profile as PayloadGetProfileData | undefined;
    if (!profileNew || profileNew.user.id == 0) {
      return;
    }

    if (profileNew.user.isAuthor !== this.isAuthor ||
      typeof this.isAuthor == 'undefined') {
      this.isAuthor = profileNew.user.isAuthor;
      this.isAuthor ? this.renderAuthorContent() :
        this.renderDonaterContent();
    }
    // this.profileInfo.update({
    //   isAuthor: profileNew.user.isAuthor,
    //   avatar: profileNew.user.avatar,
    //   username: profileNew.user.username,
    //   countSubscriptions: profileNew.user.countSubscriptions,
    //   countDonaters: profileNew.user.countDonaters ?? 0,
    //   countPosts: profileNew.user.countPosts ?? 0,
    //   countProfitMounth: profileNew.user.countProfitMounth ?? 0,
    //   countSubscribersMounth: profileNew.user.countSubscribersMounth ?? 0,
    //   balance: profileNew.user.balance ?? 0,
    // });
    if (!this.isAuthor) {
      if (!profileNew.userSubscriptions ||
        profileNew.userSubscriptions.length === 0) {
        this.subscriptions.innerHTML = '';
        const empty = document.createElement('div');
        empty.classList.add('profile-page__empty');
        const emptyText = document.createElement('div');
        emptyText.classList.add('profile-page__empty-text', 'font_regular');
        emptyText.innerHTML = this.options.changeable ?
        `Предлагаем вам перейти в поиск и найти своего первого автора.` :
        'Донатер пока никого не поддерживает.';
        empty.appendChild(emptyText);
        this.subscriptions.appendChild(empty);

        if (this.options.changeable) {
          new Button(empty, {
            actionType: 'button',
            viewType: ButtonType.OUTLINE,
            innerText: 'Перейти в поиск',
            clickHandler: () => routing('/search'),
          }).addClassNames('profile-page__search-btn');
        }
      } else {
        this.subscriptions.innerHTML = '';
        profileNew.userSubscriptions.forEach((sub) => {
          new SubscriptionLink(this.subscriptions, {
            id: sub.authorID,
            imgPath: sub.authorAvatar,
            username: sub.authorName,
            tier: `${sub.tier} уровень`,
          });
        });
      }
    } else {
      this.about.update(profileNew.user.about ?? '');
    }
  }

  protected render(): HTMLDivElement {
    const page = document.createElement('div');
    page.classList.add('profile-page');
    // const profileState = store.getState().profile as PayloadGetProfileData;
    this.childViews.profileInfo = new ProfileInfo(page, {
      changeable: this.options.changeable,
    });
    const content = document.createElement('div');
    content.classList.add('profile-page__content');
    page.appendChild(content);
    return page;
  }

  protected onErase(): void {
    this.childViews.postContainer?.erase();
    this.childViews.subscriptionCardsContainer?.erase();
    this.childViews.profileInfo?.erase();
  }

  private renderAuthorContent() {
    const content =
        querySelectorWithThrow(this.domElement, '.profile-page__content');
    content.innerHTML = '';
    this.childViews.subscriptionCardsContainer =
      new SubscriptionCardsContainer(content, {
        changeable: this.options.changeable,
      });

    this.about = new About(content, {
      aboutTextHtml: this.options.changeable ?
        `Здесь будет информация о Вас. 
        Скорее заполните ее, чтобы пользователи могли узнать о Вас больше.` :
        'Автор пока ничего о себе не рассказал.',
      id: this.options.profileID,
      changeable: this.options.changeable,
      inEditState: false,
    });
    const user = store.getState().user as PayloadUser;
    this.childViews.postContainer = new PostsContainer(content, {
      withCreateBtn: this.options.changeable && user.isAuthor,
      textWhenEmpty: this.options.changeable && user.isAuthor ?
      'Создайте свой первый пост. Можете воспользоваться кнопкой выше.' :
        'Лента данного автора пуста.',
    });
  }

  private renderDonaterContent(): void {
    const content =
        querySelectorWithThrow(this.domElement, '.profile-page__content');
    content.innerHTML = '';
    const head = document.createElement('div');
    head.classList.add('profile-page__header', 'font_big');
    head.innerText = 'Подписки';
    this.subscriptions.classList.add(
        'profile-page__subscriptions',
        'bg_main',
        'font_regular',
    );
    content.append(head, this.subscriptions);
  }
}
