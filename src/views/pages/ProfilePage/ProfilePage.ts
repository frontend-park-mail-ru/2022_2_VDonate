import store from '@app/Store';
import {PayloadUser} from '@actions/types/user';
import getProfile from '@actions/handlers/getProfileData';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import ViewBaseExtended from '@app/Page';
import About from '@components/About/About';
import ProfileInfo from '@components/ProfileInfo/ProfileInfo';
import SubscriptionsContainer
  from '@views/containers/SubscriptionsContainer/SubscriptionsContainer';
import PostsContainer from '@views/containers/PostsContainer/PostsContainer';
import {Glass, GlassType} from '@components/glass/glass';
import SubscriptionLink from '@components/SubscriptionLink/SubscriptionLink';
import './profile-page.styl';
import PageBase from '@app/Page';

interface ProfileEditorOptions {
  profileID: number
  changeable: boolean
}

interface ProfilePageChildViews {
  postContainer?: PostsContainer
  subscriptionsContainer?: SubscriptionsContainer
}

export default class ProfilePage extends PageBase {
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

  // protected beforeRegisterStore(): void {
  //   getProfile(Number(new URL(location.href).searchParams.get('id')));
  // }

  /** Оповещение об изменением хранилища */
  notify(): void {
    const profileNew =
      store.getState().profile as PayloadGetProfileData | undefined;
    if (!profileNew) {
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
      countDonaters?: number
    } = {
      isAuthor: profileNew.user.isAuthor,
      avatar: profileNew.user.avatar,
      username: profileNew.user.username,
      countSubscriptions: profileNew.user.countSubscriptions,
    };
    if (profileNew.user.isAuthor) {
      profileInfoNew.countDonaters = profileNew.user.countSubscribers;
      if (this.profileState.user.isAuthor !== profileNew.user.isAuthor) {
        profileInfoNew.isAuthor = true;
        this.profileState.user.isAuthor = profileNew.user.isAuthor;
      }
    }
    this.profileInfo.update(profileInfoNew);
    if (this.profileState.user.about !== profileNew.user.about) {
      this.about.update(profileNew.user.about ?? '');
    }
    if (!profileNew.user.isAuthor) {
      if (!profileNew.subscriptions ||
          profileNew.subscriptions.length == 0) {
        this.glass.element.innerHTML = 'Донатер пока никого не поддерживает';
      } else {
        this.glass.element.innerHTML = '';
        profileNew.subscriptions.forEach((sub) => {
          new SubscriptionLink(this.glass.element, {
            id: sub.authorID,
            imgPath: sub.authorAvatar ?? sub.img,
            username: sub.authorName ?? sub.title,
            tier: `Уровень ${sub.tier}`,
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
      countDonaters: this.profileState.user.countSubscribers,
    });

    this.childViews.subscriptionsContainer =
      new SubscriptionsContainer(this.authorContent, {
        changeable: this.options.changeable,
      });

    this.about = new About(this.authorContent, {
      aboutTextHtml: this.profileState.user.about ??
      'Пользователь пока ничего о себе не написал',
    });
    const user = store.getState().user as PayloadUser;
    this.childViews.postContainer = new PostsContainer(this.authorContent, {
      withCreateBtn: this.options.changeable && user.isAuthor,
    });
    this.donaterContent.classList.add('profile-page__content');
    const head = document.createElement('div');
    head.classList.add('profile-page__head');
    head.innerText = 'Подписки';
    this.glass.element.classList.add('profile-page__glass');
    this.donaterContent.append(head, this.glass.element);
    page.append(this.authorContent, this.donaterContent);
    return page;
  }

  protected onErase(): void {
    this.childViews.postContainer?.erase();
    this.childViews.subscriptionsContainer?.erase();
  }
}
