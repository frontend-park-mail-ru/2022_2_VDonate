import Avatar, {AvatarType} from '@components/Avatar/Avatar';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import editIcon from '@icon/edit.svg';
import './profile-info.styl';
import Button, {ButtonType} from '@components/Button/Button';
import {becomeAuthor} from '@actions/handlers/user';
import {openProfileEditor, openWithdrawEditor} from '@actions/handlers/editor';
import {notice} from '@actions/handlers/notice';
import MiniStatistic from '@components/MiniStatistic/MiniStatistic';

interface ProfileInfoOptions {
  isAuthor: boolean
  avatar: string
  username: string
  countSubscriptions: number
  countDonaters?: number
  countPosts?: number
  countProfitMounth?: number
  countSubscribersMounth?: number
  balance?: number
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
  balance: number
}

/**
 * Модель правого навбара
 */
export default
class ProfileInfo extends ComponentBase<'div', ProfileInfoUpdateContext> {
  private avatar!: Avatar;
  private username!: HTMLSpanElement;
  private miniStatistic!: MiniStatistic;

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

    if (!this.options.isAuthor && data.isAuthor) {
      this.options.isAuthor = data.isAuthor;
      if (this.options.changeable) {
        querySelectorWithThrow(this.domElement, '.profile-info__become-author')
            .remove();
        this.renderBalance(
            querySelectorWithThrow(this.domElement, '.profile-info__back'),
        );
      }
    } else if (this.options.isAuthor && !data.isAuthor) {
      this.options.isAuthor = false;
      if (this.options.changeable) {
        new Button(
            querySelectorWithThrow(this.domElement, '.profile-info'),
            {
              viewType: ButtonType.PRIMARY,
              actionType: 'button',
              innerText: 'Стать автором',
              clickHandler: () => {
                becomeAuthor(this.options.id);
              },
            }).addClassNames('profile-info__become-author');
        querySelectorWithThrow(this.domElement, '.balance-area').remove();
      }
    }

    this.miniStatistic.update({
      countSubscriptions: data.countSubscriptions,
      countDonaters: data.countDonaters,
      countPosts: data.countPosts,
      countProfitMounth: data.countProfitMounth,
      countSubscribersMounth: data.countSubscribersMounth,
      isAuthor: data.isAuthor,
    });
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

    back.append(this.username, info);

    if (this.options.isAuthor) {
      this.miniStatistic = new MiniStatistic(info, {
        countDonaters: this.options.countDonaters,
        countPosts: this.options.countPosts,
        countProfitMounth: this.options.countProfitMounth,
        countSubscribersMounth: this.options.countSubscribersMounth,
        isAuthor: true,
        changeable: this.options.changeable,
      });
      if (this.options.changeable) {
        this.renderBalance(back);
      }
    } else {
      this.miniStatistic = new MiniStatistic(info, {
        countSubscriptions: this.options.countSubscriptions,
        isAuthor: false,
        changeable: this.options.changeable,
      });
      if (this.options.changeable) {
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

  private renderBalance(div: HTMLElement) {
    const balanceArea = document.createElement('div');
    balanceArea.classList.add('profile-info__balance-area', 'balance-area');
    const balance = document.createElement('span');
    balance.classList.add('balance-area__balance-span', 'font_regular');
    balance.innerHTML = `Баланс ${this.options.balance ?? 0}&#8381;`;
    balanceArea.appendChild(balance);
    new Button(balanceArea, {
      viewType: ButtonType.PRIMARY,
      actionType: 'button',
      innerText: 'Вывести деньги',
      clickHandler: () => {
        // openWithdrawEditor();
        if (this.options.balance) {
          openWithdrawEditor();
        } else {
          notice('Ваш баланс равен нулю', 'info');
        }
      },
    }).addClassNames('balance-area__withdraw');
    div.appendChild(balanceArea);
  }
}
