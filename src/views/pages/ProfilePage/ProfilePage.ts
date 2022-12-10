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
  private authorContent: HTMLDivElement = document.createElement('div');
  private donaterContent: HTMLDivElement = document.createElement('div');
  private isAuthor: boolean;
  private about!: About;
  private profileInfo!: ProfileInfo;
  private profileState: PayloadGetProfileData;
  private subscriptions: HTMLDivElement = document.createElement('div');
  private childViews: ProfilePageChildViews = {};

  constructor(el: HTMLElement, private options: ProfileEditorOptions) {
    super();
    this.profileState = store.getState().profile as PayloadGetProfileData;
    this.isAuthor = this.profileState.user.isAuthor;
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
    if (profileNew.user.isAuthor !== this.isAuthor) {
      this.isAuthor = profileNew.user.isAuthor;
      this.isAuthor ? this.renderAuthorContent(this.domElement) :
        this.renderDonaterContent(this.domElement);
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
        this.subscriptions.innerHTML = 'Донатер пока никого не поддерживает';
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
    this.profileInfo = new ProfileInfo(page, {
      avatar: this.profileState.user.avatar,
      countSubscriptions: this.profileState.user.countSubscriptions,
      isAuthor: this.profileState.user.isAuthor,
      username: this.profileState.user.username,
      countDonaters: this.profileState.user.countDonaters,
      id: this.options.profileID,
      changeable: this.options.changeable,
    });
    this.isAuthor ? this.renderAuthorContent(page) :
      this.renderDonaterContent(page);
    return page;
  }

  protected onErase(): void {
    this.childViews.postContainer?.erase();
    this.childViews.subscriptionCardsContainer?.erase();
  }

  private renderAuthorContent(page: HTMLDivElement) {
    this.authorContent.classList.add('profile-page__content');
    this.childViews.subscriptionCardsContainer =
      new SubscriptionCardsContainer(this.authorContent, {
        changeable: this.options.changeable,
      });

    this.about = new About(this.authorContent, {
      aboutTextHtml: 'Пользователь пока ничего о себе не написал',
      id: this.options.profileID,
      changeable: this.options.changeable,
      inEditState: false,
    });
    const user = store.getState().user as PayloadUser;
    this.childViews.postContainer = new PostsContainer(this.authorContent, {
      withCreateBtn: this.options.changeable && user.isAuthor,
      textWhenEmpty: this.options.changeable && user.isAuthor ?
      `Тут будут Ваши посты\n
        Начните радовать своих донатеров новым контентом уже сейчас` :
        `Автор пока что не создал ни одного поста`,
    });
    querySelectorWithThrow(page, '.profile-page__content').remove();
    page.appendChild(this.authorContent);
  }

  private renderDonaterContent(page: HTMLDivElement): void {
    this.donaterContent.classList.add('profile-page__content');
    const head = document.createElement('div');
    head.classList.add('profile-page__header', 'font_big');
    head.innerText = 'Подписки';
    this.subscriptions.classList.add(
        'profile-page__subscriptions',
        'bg_content',
        'font_regular',
    );
    this.subscriptions.innerHTML = this.options.changeable ?
    `Вы пока никого не поддерживаете\n
    Попробуйте найти интересующих Вас авторов на странице поиска` :
    'Донатер пока никого не поддерживает';
    this.donaterContent.append(head, this.subscriptions);
    page.appendChild(this.donaterContent);
  }
}
