import Avatar, {AvatarType} from '@components/Avatar/Avatar';
import ComponentBase from '@flux/types/component';
import './profile-mini.styl';

export enum ProfileMiniType {
  SESSION_PROFILE,
  OTHER_PROFILE,
}

interface ProfileMiniOptions {
  avatar: string;
  username: string;
  isAuthor: boolean;
  id: number;
  type: ProfileMiniType;
}

interface ProfileMiniUpdateContext {
  avatar: string;
  username: string;
  isAuthor: boolean;
}


export default
class ProfielMini extends ComponentBase<'a', ProfileMiniUpdateContext> {
  private avatar!: Avatar;
  private username: HTMLSpanElement = document.createElement('span');

  constructor(el: HTMLElement, private options: ProfileMiniOptions) {
    super();
    this.renderTo(el);
  }

  update(data: ProfileMiniUpdateContext): void {
    if (data.avatar !== this.options.avatar) {
      this.options.avatar = data.avatar;
      this.avatar.update(data.avatar);
    }
    if (data.username !== this.options.username) {
      this.options.username = data.username;
      this.username.innerText = data.username;
    }
    if (data.isAuthor !== this.options.isAuthor) {
      this.options.isAuthor = data.isAuthor;
      this.avatar.update(
        data.isAuthor ? AvatarType.AUTHOR : AvatarType.DONATER,
      );
    }
  }

  protected render(): HTMLAnchorElement {
    const container = document.createElement('a');
    container.className = 'profile-mini';
    container.href = `/profile?id=${this.options.id}`;
    container.setAttribute('data-link', '');
    this.avatar = new Avatar(container, {
      imgPath: this.options.avatar,
      viewType: this.options.isAuthor ? AvatarType.AUTHOR : AvatarType.DONATER,
    });

    this.username.classList.add('font_regular', 'profile-mini__username');
    this.username.innerText = this.options.username;
    container.appendChild(this.username);

    switch (this.options.type) {
      case ProfileMiniType.SESSION_PROFILE:
        this.avatar.addClassNames('profile-mini__avatar_size_big');
        this.username.classList.add('profile-mini__username_bold');
        break;
      case ProfileMiniType.OTHER_PROFILE:
        this.avatar.addClassNames('profile-mini__avatar_size_small');
        break;
      default:
        break;
    }

    return container;
  }
}
