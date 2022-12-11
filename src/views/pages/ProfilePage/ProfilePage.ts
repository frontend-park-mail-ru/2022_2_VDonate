import store from '@app/Store';
import {PayloadUser} from '@actions/types/user';
import getProfile from '@actions/handlers/getProfileData';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import About from '@components/About/About';
import ProfileInfo from '@components/ProfileInfo/ProfileInfo';
import PostsContainer from '@views/containers/PostsContainer/PostsContainer';
import SubscriptionLink from '@components/SubscriptionLink/SubscriptionLink';
import './profile-page.styl';
import SubscriptionCardsContainer
  from
  '@views/containers/SubscriptionCardsContainer/SubscriptionCardsContainer';
import UpgradeViewBase from '@app/UpgradeView';
import {querySelectorWithThrow} from '@flux/types/component';

interface ProfileEditorOptions {
  profileID: number
  changeable: boolean
}

interface ProfilePageChildViews {
  postContainer?: PostsContainer
  subscriptionCardsContainer?: SubscriptionCardsContainer
}

export default class ProfilePage extends UpgradeViewBase {
  private isAuthor: boolean | undefined;
  private profileInfo!: ProfileInfo;
  private subscriptions: HTMLDivElement = document.createElement('div');
  private childViews: ProfilePageChildViews = {};

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

    // TODO Переделать на 2 отдельные функции рендера в один компонент
    if (profileNew.user.isAuthor !== this.isAuthor ||
      typeof this.isAuthor == 'undefined') {
      this.isAuthor = profileNew.user.isAuthor;
      this.isAuthor ? this.renderAuthorContent() :
        this.renderDonaterContent();
    }
    this.profileInfo.update({
      isAuthor: profileNew.user.isAuthor,
      avatar: profileNew.user.avatar,
      username: profileNew.user.username,
      countSubscriptions: profileNew.user.countSubscriptions,
      countDonaters: profileNew.user.countDonaters ?? 0,
    });
    if (!this.isAuthor) {
      if (!profileNew.userSubscriptions ||
        profileNew.userSubscriptions.length === 0) {
        this.subscriptions.innerHTML = this.options.changeable ?
          `Вы пока никого не поддерживаете<br> <br>
          Попробуйте найти интересующих Вас авторов на странице поиска` :
          'Донатер пока никого не поддерживает';
      } else {
        this.subscriptions.innerHTML = '';
        profileNew.userSubscriptions.forEach((sub, idx, arr) => {
          new SubscriptionLink(this.subscriptions, {
            id: sub.authorID,
            imgPath: sub.authorAvatar,
            username: sub.authorName,
            tier: `Уровень ${sub.tier}`,
            isLast: idx === arr.length - 1,
          });
        });
      }
    }
  }

  protected render(): HTMLDivElement {
    const page = document.createElement('div');
    page.classList.add('profile-page');
    const profileState = store.getState().profile as PayloadGetProfileData;
    this.profileInfo = new ProfileInfo(page, {
      avatar: profileState.user.avatar,
      countSubscriptions: profileState.user.countSubscriptions,
      isAuthor: profileState.user.isAuthor,
      username: profileState.user.username,
      countDonaters: profileState.user.countDonaters,
      id: this.options.profileID,
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
  }

  private renderAuthorContent() {
    const content =
        querySelectorWithThrow(this.domElement, '.profile-page__content');
    content.innerHTML = '';
    this.childViews.subscriptionCardsContainer =
      new SubscriptionCardsContainer(content, {
        changeable: this.options.changeable,
      });

    new About(content, {
      aboutTextHtml: 'Пользователь пока ничего о себе не написал',
      id: this.options.profileID,
      changeable: this.options.changeable,
      inEditState: false,
    });
    const user = store.getState().user as PayloadUser;
    this.childViews.postContainer = new PostsContainer(content, {
      withCreateBtn: this.options.changeable && user.isAuthor,
      textWhenEmpty: this.options.changeable && user.isAuthor ?
      `Тут будут Ваши посты\n
        Начните радовать своих донатеров новым контентом уже сейчас` :
        `Автор пока что не создал ни одного поста`,
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
        'bg_content',
    );
    content.append(head, this.subscriptions);
  }
}
