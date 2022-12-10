import Avatar, {AvatarType} from '@components/Avatar/Avatar';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import './profile-info.styl';
import Button, {ButtonType} from '@components/Button/Button';
import {becomeAuthor} from '@actions/handlers/user';

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
  id: number
  changeable: boolean
}

// type ProfileInfoOptions = ProfileInfoDonater | ProfileInfoAuthor

interface ProfileInfoUpdateContext {
  isAuthor: boolean
  avatar: string
  username: string
  countSubscriptions: number
  countDonaters: number
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
    this.avatar.update(data.avatar);

    if (this.options.username !== data.username) {
      this.options.username = data.username;
      this.username.innerText = this.options.username;
    }

    if (this.options.countSubscriptions !== data.countSubscriptions) {
      this.options.countSubscriptions = data.countSubscriptions;
      this.countSubscriptions.innerText = data.countSubscriptions.toString();
    }

    if (!this.options.isAuthor && data.isAuthor) {
      this.options.isAuthor = data.isAuthor;
      const info =
        querySelectorWithThrow(this.domElement, '.profile-info');
      const donatersContainer = document.createElement('div');
      donatersContainer.classList
          .add('profile-info__container');
      const donaters = document.createElement('span');
      donaters.classList.add('profile-info__donaters', 'font_regular');
      donaters.innerText = 'Донатеров';
      this.countDonaters = document.createElement('span');
      this.countDonaters.classList.add('profile-info__count');
      this.countDonaters.innerText = data.countDonaters.toString();
      donatersContainer.append(donaters, this.countDonaters);
      info.appendChild(donatersContainer);
      if (this.options.changeable) {
        querySelectorWithThrow(this.domElement, '.right-navbar__become-author')
            .remove();
      }
    } else if (this.options.isAuthor && !data.isAuthor) {
      this.options.isAuthor = false;
      querySelectorWithThrow(this.domElement, '.profile-info__donaters')
          .parentElement?.remove();
    }

    if (this.options.isAuthor &&
      this.options.countDonaters !== data.countDonaters) {
      this.options.countDonaters = data.countDonaters;
      this.countDonaters.innerText = data.countDonaters.toString();
    }
  }

  protected render(): HTMLDivElement {
    const profileInfo = document.createElement('div');
    profileInfo.classList
        .add('right-navbar');

    const back = document.createElement('div');
    back.classList.add('right-navbar__back', 'bg_content');

    this.avatar = new Avatar(back, {
      viewType: this.options.isAuthor ? AvatarType.AUTHOR : AvatarType.DONATER,
      imgPath: this.options.avatar,
    });
    this.avatar.addClassNames('right-navbar__img');

    this.username = document.createElement('span');
    this.username.classList.add('right-navbar__username', 'font_big');
    this.username.innerText = this.options.username;

    const info = document.createElement('div');
    info.classList.add('profile-info');

    const subsContainer = document.createElement('div');
    subsContainer.classList.add('profile-info__container');

    const subscriptionsTitle = document.createElement('span');
    subscriptionsTitle.classList.add('profile-info__subs', 'font_regular');
    subscriptionsTitle.innerText = 'Подписок';

    this.countSubscriptions = document.createElement('span');
    this.countSubscriptions.classList
        .add('profile-info__count', 'font_regular');
    this.countSubscriptions.innerText =
      this.options.countSubscriptions.toString();

    subsContainer.append(subscriptionsTitle, this.countSubscriptions);
    info.appendChild(subsContainer);

    if (this.options.isAuthor) {
      const donatersContainer = document.createElement('div');
      donatersContainer.classList
          .add('profile-info__container');
      const donaters = document.createElement('span');
      donaters.classList.add('profile-info__donaters');
      donaters.innerText = 'Донатеров';
      this.countDonaters = document.createElement('span');
      this.countDonaters.classList.add('profile-info__count', 'font_regular');
      this.countDonaters.innerText =
        this.options.countDonaters?.toString() ?? '0';
      donatersContainer.append(donaters, this.countDonaters);
      info.appendChild(donatersContainer);
    } else if (this.options.changeable) {
      const becomeAuthorBtn = new Button(back, {
        viewType: ButtonType.PRIMARY,
        actionType: 'button',
        innerText: 'Стать автором',
        clickHandler: () => {
          becomeAuthor(this.options.id);
        },
      });
      becomeAuthorBtn.addClassNames('right-navbar__become-author');
    }

    back.append(this.username, info);
    profileInfo.append(back);
    return profileInfo;
  }
}
