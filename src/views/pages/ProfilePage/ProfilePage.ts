import store from '@app/Store';
import {PayloadUser} from '@actions/types/user';
import getProfile from '@actions/handlers/getProfileData';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import About from '@components/About/About';
import ProfileInfo from '@components/ProfileInfo/ProfileInfo';
import PostsContainer from '@views/containers/PostsContainer/PostsContainer';
import {Glass, GlassType} from '@components/glass/glass';
import SubscriptionLink from '@components/SubscriptionLink/SubscriptionLink';
import './profile-page.styl';
import SubscriptionCardsContainer
  from
  '@views/containers/SubscriptionCardsContainer/SubscriptionCardsContainer';
import UpgradeViewBase from '@app/UpgradeView';

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
  private about!: About;
  private profileInfo!: ProfileInfo;
  private glass: Glass = new Glass(GlassType.mono);
  private profileState: PayloadGetProfileData;

  private childViews: ProfilePageChildViews = {};

  constructor(el: HTMLElement, private options: ProfileEditorOptions) {
    super();
    this.profileState = store.getState().profile as PayloadGetProfileData;
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

    if (profileNew.user.isAuthor) {
      this.authorContent.hidden = false;
      this.donaterContent.hidden = true;
    } else {
      this.authorContent.hidden = true;
      this.donaterContent.hidden = false;
    }
    const profileInfoNew: {
      isAuthor: boolean
      avatar: string
      username: string
      countSubscriptions: number
      countDonaters: number
    } = {
      isAuthor: profileNew.user.isAuthor,
      avatar: profileNew.user.avatar,
      username: profileNew.user.username,
      countSubscriptions: profileNew.user.countSubscriptions,
      countDonaters: profileNew.user.countDonaters ?? 0,
    };
    this.profileInfo.update(profileInfoNew);
    this.about.update(profileNew.user.about ?? '');
    if (!profileNew.user.isAuthor) {
      if (!profileNew.userSubscriptions ||
          profileNew.userSubscriptions.length === 0) {
        this.glass.element.innerHTML = 'Донатер пока никого не поддерживает';
      } else {
        this.glass.element.innerHTML = '';
        profileNew.userSubscriptions.forEach((sub, idx, arr) => {
          new SubscriptionLink(this.glass.element, {
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
    this.authorContent.classList.add('profile-page__content');
    this.profileInfo = new ProfileInfo(page, {
      avatar: this.profileState.user.avatar,
      countSubscriptions: this.profileState.user.countSubscriptions,
      isAuthor: this.profileState.user.isAuthor,
      username: this.profileState.user.username,
      countDonaters: this.profileState.user.countDonaters,
      id: this.options.profileID,
      changeable: this.options.changeable,
    });

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
    this.donaterContent.classList.add('profile-page__content');
    const head = document.createElement('div');
    head.classList.add('profile-page__head');
    head.innerText = 'Подписки';
    this.glass.element.classList.add('profile-page__glass');
    this.glass.element.innerHTML = 'Донатер пока никого не поддерживает';
    this.donaterContent.append(head, this.glass.element);
    page.append(this.authorContent, this.donaterContent);
    this.authorContent.hidden = true;
    this.donaterContent.hidden = true;
    return page;
  }

  protected onErase(): void {
    this.childViews.postContainer?.erase();
    this.childViews.subscriptionCardsContainer?.erase();
  }
}
