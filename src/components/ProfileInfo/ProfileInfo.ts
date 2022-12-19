import Avatar, {AvatarType} from '@components/Avatar/Avatar';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import editIcon from '@icon/edit.svg';
import './profile-info.styl';
import Button, {ButtonType} from '@components/Button/Button';
import {becomeAuthor} from '@actions/handlers/user';
import {openProfileEditor} from '@actions/handlers/editor';

interface ProfileInfoOptions {
  isAuthor: boolean
  avatar: string
  username: string
  countSubscriptions: number
  countDonaters?: number
  countPosts?: number
  countProfitMounth?: number
  countSubscribersMounth?: number
  id: number
  changeable: boolean
}

interface ProfileInfoUpdateContext {
  isAuthor: boolean
  avatar: string
  username: string
  countSubscriptions: number
  countDonaters: number
  countPosts: number
  countProfitMounth: number
  countSubscribersMounth: number
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
  private countPosts!: HTMLSpanElement;
  private countProfitMounth!: HTMLSpanElement;
  private countSubscribersMounth!: HTMLSpanElement;

  constructor(el: HTMLElement, private options: ProfileInfoOptions) {
    super();
    this.renderTo(el);
  }

  update(data: ProfileInfoUpdateContext): void {
    this.avatar.update(data.avatar);
    this.avatar.update(data.isAuthor ? AvatarType.AUTHOR : AvatarType.DONATER);
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
        querySelectorWithThrow(this.domElement, '.mini-statistic');
      this.renderStatistic(info);
      if (this.options.changeable) {
        querySelectorWithThrow(this.domElement, '.profile-info__become-author')
            .remove();
      }
    } else if (this.options.isAuthor && !data.isAuthor) {
      this.options.isAuthor = false;
      this.countDonaters.parentElement?.remove();
    }

    if (this.options.isAuthor) {
      if (this.options.countDonaters !== data.countDonaters) {
        this.options.countDonaters = data.countDonaters;
        this.countDonaters.innerText = data.countDonaters.toString();
      }
      if (this.options.countPosts !== data.countPosts) {
        this.options.countPosts = data.countPosts;
        this.countPosts.innerText = data.countPosts.toString();
      }
      if (this.options.countProfitMounth !== data.countProfitMounth) {
        this.options.countProfitMounth = data.countProfitMounth;
        this.countProfitMounth.innerText = data.countProfitMounth.toString();
      }
      if (this.options.countSubscribersMounth !== data.countSubscribersMounth) {
        this.options.countSubscribersMounth = data.countSubscribersMounth;
        this.countSubscribersMounth.innerText =
          data.countSubscribersMounth.toString();
      }
    }
  }

  protected render(): HTMLDivElement {
    const profileInfo = document.createElement('div');
    profileInfo.classList
        .add('profile-info');

    const back = document.createElement('div');
    back.classList.add('profile-info__back', 'bg_main');

    this.avatar = new Avatar(back, {
      viewType: this.options.isAuthor ? AvatarType.AUTHOR : AvatarType.DONATER,
      imgPath: this.options.avatar,
    });
    this.avatar.addClassNames('profile-info__img');

    this.username = document.createElement('span');
    this.username.classList.add('profile-info__username', 'font_big');
    this.username.innerText = this.options.username;

    const info = document.createElement('div');
    info.classList.add('profile-info__info-area');

    const miniStatistic = document.createElement('div');
    miniStatistic.classList.add('mini-statistic');
    info.appendChild(miniStatistic);

    const subsContainer = document.createElement('div');
    subsContainer.classList.add('mini-statistic__container');

    const subscriptionsTitle = document.createElement('span');
    subscriptionsTitle.classList.add('mini-statistic__text', 'font_regular');
    subscriptionsTitle.innerText = 'Подписок';

    this.countSubscriptions = document.createElement('span');
    this.countSubscriptions.classList
        .add('mini-statistic__text', 'font_regular');
    this.countSubscriptions.innerText =
      this.options.countSubscriptions.toString();

    subsContainer.append(subscriptionsTitle, this.countSubscriptions);
    miniStatistic.appendChild(subsContainer);

    back.append(this.username, info);

    if (this.options.isAuthor) {
      this.renderStatistic(miniStatistic);
    } else if (this.options.changeable) {
      const becomeAuthorBtn = new Button(back, {
        viewType: ButtonType.PRIMARY,
        actionType: 'button',
        innerText: 'Стать автором',
        clickHandler: () => {
          becomeAuthor(this.options.id);
        },
      });
      becomeAuthorBtn.addClassNames('profile-info__become-author');
    }

    if (this.options.changeable) {
      new Button(back, {
        viewType: ButtonType.ICON,
        actionType: 'button',
        innerIcon: editIcon,
        clickHandler: () => {
          openProfileEditor();
        },
      }).addClassNames('profile-info__edit-btn');
    }

    profileInfo.append(back);
    return profileInfo;
  }

  private renderStatistic(miniStatistic: HTMLElement) {
    const donatersContainer = document.createElement('div');
    donatersContainer.classList
        .add('mini-statistic__container');
    const donaters = document.createElement('span');
    donaters.classList.add('mini-statistic__text', 'font_regular');
    donaters.innerText = 'Донатеров';
    this.countDonaters = document.createElement('span');
    this.countDonaters.classList.add('mini-statistic__text', 'font_regular');
    this.countDonaters.innerText =
      this.options.countDonaters?.toString() ?? '0';
    donatersContainer.append(donaters, this.countDonaters);
    miniStatistic.appendChild(donatersContainer);
    const postsContainer = document.createElement('div');
    postsContainer.classList
        .add('mini-statistic__container');
    const posts = document.createElement('span');
    posts.classList.add('mini-statistic__text', 'font_regular');
    posts.innerText = 'Постов';
    this.countPosts = document.createElement('span');
    this.countPosts.classList.add('mini-statistic__text', 'font_regular');
    this.countPosts.innerText =
      this.options.countPosts?.toString() ?? '0';
    postsContainer.append(posts, this.countPosts);
    miniStatistic.appendChild(postsContainer);
    const profitContainer = document.createElement('div');
    profitContainer.classList
        .add('mini-statistic__container');
    const profit = document.createElement('span');
    profit.classList.add('mini-statistic__text', 'font_regular');
    profit.innerText = 'Заработок за месяц';
    this.countProfitMounth = document.createElement('span');
    this.countProfitMounth
        .classList.add('mini-statistic__text', 'font_regular');
    this.countProfitMounth.innerText =
      this.options.countProfitMounth?.toString() ?? '0';
    profitContainer.append(profit, this.countProfitMounth);
    miniStatistic.appendChild(profitContainer);
    const subPerMounthContainer = document.createElement('div');
    subPerMounthContainer.classList
        .add('mini-statistic__container');
    const subPerMounth = document.createElement('span');
    subPerMounth.classList.add('mini-statistic__text', 'font_regular');
    subPerMounth.innerText = 'Подписчиков за месяц';
    this.countSubscribersMounth = document.createElement('span');
    this.countSubscribersMounth
        .classList.add('mini-statistic__text', 'font_regular');
    this.countSubscribersMounth.innerText =
      this.options.countSubscribersMounth?.toString() ?? '0';
    subPerMounthContainer.append(subPerMounth, this.countSubscribersMounth);
    miniStatistic.appendChild(subPerMounthContainer);
  }
}
