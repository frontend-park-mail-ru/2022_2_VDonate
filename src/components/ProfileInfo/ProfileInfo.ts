import {Glass, GlassType} from '@components/glass/glass';
import Avatar, {AvatarType} from '@components/Avatar/Avatar';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import './profile-info.styl';

// interface ProfileInfoDonater {
//   isAuthor: false
//   avatar: string
//   username: string
//   countSubscriptions: number
// }

interface ProfileInfoOptions {
  isAuthor: boolean
  avatar: string
  username: string
  countSubscriptions: number
  countDonaters?: number
}

// type ProfileInfoOptions = ProfileInfoDonater | ProfileInfoAuthor

interface ProfileInfoUpdateContext {
  isAuthor?: true
  avatar?: string
  username?: string
  countSubscriptions?: number
  countDonaters?: number
}

/**
 * Модель правого навбара
 */
export default
class ProfileInfo extends ComponentBase<'div', ProfileInfoUpdateContext> {
  private avatar!: Avatar;
  private username!: HTMLSpanElement;
  private countSubscriptions!: HTMLSpanElement;
  private countDonaters!: HTMLSpanElement;


  constructor(el: HTMLElement, private options: ProfileInfoOptions) {
    super();
    this.renderTo(el);
  }

  update(data: ProfileInfoUpdateContext): void {
    if (data.avatar) {
      this.avatar.update(data.avatar);
    }
    if (data.username) {
      this.username.innerText = data.username;
    }
    if (data.countSubscriptions) {
      this.countSubscriptions.innerText = data.countSubscriptions.toString();
    }
    if (data.isAuthor) {
      const info =
        querySelectorWithThrow(this.domElement, '.right-navbar__profile_info');
      const donatersContainer = document.createElement('div');
      donatersContainer.classList
          .add('right-navbar__profile_info_container');
      const donaters = document.createElement('span');
      donaters.classList.add('right-navbar__profile_info_donaters');
      donaters.innerText = 'Донатеров';
      this.countDonaters = document.createElement('span');
      this.countDonaters.classList.add('right-navbar__profile_info_count');
      this.countDonaters.innerText = data.countDonaters?.toString() ?? '0';
      donatersContainer.append(donaters, this.countDonaters);
      info.appendChild(donatersContainer);
    }
    if (this.options.isAuthor && data.countDonaters) {
      this.countDonaters.innerText = data.countDonaters.toString();
    }
  }

  protected render(): HTMLDivElement {
    const profileInfo = document.createElement('div');
    profileInfo.classList.add('right-navbar');

    const glass = new Glass(GlassType.mono).element;
    glass.classList.add('right-navbar__glass');
    glass.classList.add('right-navbar__profile');

    this.avatar = new Avatar(glass, {
      viewType: this.options.isAuthor ? AvatarType.AUTHOR : AvatarType.DONATER,
      image: this.options.avatar,
    });
    this.avatar.addClassNames('right-navbar__profile_img');

    this.username = document.createElement('span');
    this.username.classList.add('right-navbar__profile_username');
    this.username.innerText = this.options.username;

    const info = document.createElement('div');
    info.classList.add('right-navbar__profile_info');

    const subsContainer = document.createElement('div');
    subsContainer.classList.add('right-navbar__profile_info_container');

    const subscriptionsTitle = document.createElement('span');
    subscriptionsTitle.classList.add('right-navbar__profile_info_subs');
    subscriptionsTitle.innerText = 'Подписок';

    this.countSubscriptions = document.createElement('span');
    this.countSubscriptions.classList.add('right-navbar__profile_info_count');
    this.countSubscriptions.innerText =
      this.options.countSubscriptions.toString();

    subsContainer.append(subscriptionsTitle, this.countSubscriptions);
    info.appendChild(subsContainer);

    if (this.options.isAuthor) {
      const donatersContainer = document.createElement('div');
      donatersContainer.classList
          .add('right-navbar__profile_info_container');
      const donaters = document.createElement('span');
      donaters.classList.add('right-navbar__profile_info_donaters');
      donaters.innerText = 'Донатеров';
      this.countDonaters = document.createElement('span');
      this.countDonaters.classList.add('right-navbar__profile_info_count');
      this.countDonaters.innerText =
        this.options.countDonaters?.toString() ?? '0';
      donatersContainer.append(donaters, this.countDonaters);
      info.appendChild(donatersContainer);
    }

    glass.append(this.username, info);
    profileInfo.appendChild(glass);
    return profileInfo;
  }
}
