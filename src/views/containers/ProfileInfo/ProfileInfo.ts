import Avatar, {AvatarType} from '@components/Avatar/Avatar';
import {querySelectorWithThrow} from '@flux/types/component';
import editIcon from '@icon/edit.svg';
import './profile-info.styl';
import Button, {ButtonType} from '@components/Button/Button';
import {becomeAuthor} from '@actions/handlers/user';
import {openProfileEditor, openWithdrawEditor} from '@actions/handlers/editor';
import {notice} from '@actions/handlers/notice';
import MiniStatistic from '@components/MiniStatistic/MiniStatistic';
import FollowButton from '@components/FollowButton/FollowButton';
import UpgradeViewBase from '@app/UpgradeView';
import store from '@app/Store';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import {PayloadSubscription} from '@actions/types/subscribe';

interface ProfileInfoOptions {
  changeable: boolean
}

/**
 * Модель правого навбара
 */
export default
class ProfileInfo extends UpgradeViewBase {
  private avatar!: Avatar;
  private username!: HTMLSpanElement;
  private miniStatistic!: MiniStatistic;
  private followButton?: FollowButton;
  private profileState: PayloadGetProfileData;

  constructor(el: HTMLElement, private options: ProfileInfoOptions) {
    super();
    this.profileState = Object.assign({},
      store.getState().profile as PayloadGetProfileData);
    this.renderTo(el);
  }

  notify(): void {
    const profileNew =
      store.getState().profile as PayloadGetProfileData;
    this.avatar.update(profileNew.user.avatar);
    this.avatar.update(profileNew.user.isAuthor ?
      AvatarType.AUTHOR : AvatarType.DONATER);

    if (this.profileState.user.id !== profileNew.user.id) {
      this.profileState.user.id = profileNew.user.id;
    }
    if (this.profileState.user.username !== profileNew.user.username) {
      this.profileState.user.username = profileNew.user.username;
      this.username.innerText = this.profileState.user.username;
    }

    this.miniStatistic.update({
      countSubscriptions: profileNew.user.countSubscriptions,
      countDonaters: profileNew.user.countDonaters,
      countPosts: profileNew.user.countPosts,
      countProfitMounth: profileNew.user.countProfitMounth,
      countSubscribersMounth: profileNew.user.countSubscribersMounth,
      isAuthor: profileNew.user.isAuthor,
    });

    if (!this.profileState.user.isAuthor && profileNew.user.isAuthor) {
      this.profileState.user.isAuthor = profileNew.user.isAuthor;
      if (this.options.changeable) {
        querySelectorWithThrow(this.domElement, '.profile-info__become-author')
            .remove();
        this.renderBalance(
            querySelectorWithThrow(this.domElement, '.profile-info__back'),
        );
      } else {
        // TODO Кнопка подписки
        const sub =
          [...(store.getState()
              .userSubscriptions as Map<number, PayloadSubscription>)
              .entries(),
          ].find(([, value]) => value.authorID === profileNew.user.id);
        const back =
          querySelectorWithThrow(this.domElement, '.profile-info__back');
        if (sub) {
          this.followButton = new FollowButton(back, {
            authorID: profileNew.user.id,
            isFollowed: true,
            subscriptionID: sub[1].id,
          });
        } else {
          this.followButton = new FollowButton(back, {
            authorID: profileNew.user.id,
            isFollowed: false,
          });
        }
      }
    } else if (this.profileState.user.isAuthor && !profileNew.user.isAuthor) {
      this.profileState.user.isAuthor = profileNew.user.isAuthor;
      if (this.options.changeable) {
        querySelectorWithThrow(this.domElement, '.balance-area').remove();
        new Button(
            querySelectorWithThrow(this.domElement, '.profile-info'),
            {
              viewType: ButtonType.PRIMARY,
              actionType: 'button',
              innerText: 'Стать автором',
              clickHandler: () => {
                becomeAuthor(this.profileState.user.id);
              },
            }).addClassNames('profile-info__become-author');
      } else {
        // TODO Кнопка подписки удалить
        this.followButton?.remove();
      }
    }

    if (this.profileState.user.isAuthor &&
        this.options.changeable &&
        this.profileState.user.balance !== profileNew.user.balance) {
      this.profileState.user.balance = profileNew.user.balance;
      querySelectorWithThrow(this.domElement, '.balance-area__count')
          .innerHTML = `${this.profileState.user.balance ?? 0} &#8381;`;
    }

    const sub =
    (store.getState()
        .userSubscriptions as Map<number, PayloadSubscription>);
    console.log(sub);
    if (sub.get(-this.profileState.user.id)) {
      console.log('отписаться');
      this.followButton?.update({isFollowed: true,
        subscriptionID: -this.profileState.user.id,
      });
    } else {
      console.log('подписаться');
      this.followButton?.update({isFollowed: false});
    }
  }

  protected render(): HTMLDivElement {
    const profileInfo = document.createElement('div');
    profileInfo.classList
        .add('profile-info');

    const back = document.createElement('div');
    back.classList.add('profile-info__back', 'bg_main');

    this.avatar = new Avatar(back, {
      viewType: this.profileState.user.isAuthor ?
        AvatarType.AUTHOR : AvatarType.DONATER,
      imgPath: this.profileState.user.avatar,
    });
    this.avatar.addClassNames('profile-info__img');

    this.username = document.createElement('span');
    this.username.classList.add('profile-info__username', 'font_big');
    this.username.innerText = this.profileState.user.username;

    const info = document.createElement('div');
    info.classList.add('profile-info__info-area');

    back.append(this.username, info);

    if (this.profileState.user.isAuthor) {
      this.miniStatistic = new MiniStatistic(info, {
        countDonaters: this.profileState.user.countDonaters,
        countPosts: this.profileState.user.countPosts,
        countProfitMounth: this.profileState.user.countProfitMounth,
        countSubscribersMounth: this.profileState.user.countSubscribersMounth,
        isAuthor: true,
        changeable: this.options.changeable,
      });
      if (this.options.changeable) {
        this.renderBalance(back);
      } else {
        // TODO Кнопка подписки
        const sub =
          [...(store.getState()
              .userSubscriptions as Map<number, PayloadSubscription>)
              .entries(),
          ].find(([, value]) => value.authorID === this.profileState.user.id);
        if (sub) {
          this.followButton = new FollowButton(back, {
            authorID: this.profileState.user.id,
            isFollowed: true,
            subscriptionID: sub[1].id,
          });
        } else {
          this.followButton = new FollowButton(back, {
            authorID: this.profileState.user.id,
            isFollowed: false,
          });
        }
      }
    } else {
      this.miniStatistic = new MiniStatistic(info, {
        countSubscriptions: this.profileState.user.countSubscriptions,
        isAuthor: false,
        changeable: this.options.changeable,
      });
      if (this.options.changeable) {
        const becomeAuthorBtn = new Button(back, {
          viewType: ButtonType.PRIMARY,
          actionType: 'button',
          innerText: 'Стать автором',
          clickHandler: () => {
            becomeAuthor(this.profileState.user.id);
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

    const balanceDiv = document.createElement('div');
    balanceDiv.classList.add('statistic');
    balanceArea.appendChild(balanceDiv);

    const balanceTitle = document.createElement('span');
    balanceTitle.classList
        .add('balance-area__text', 'statistic__text', 'font_regular');
    balanceTitle.innerHTML = `Баланс`;
    balanceDiv.appendChild(balanceTitle);

    const balance = document.createElement('span');
    balance.classList
        .add('balance-area__count', 'statistic__text', 'font_regular');
    balance.innerHTML = `${this.profileState.user.balance ?? 0} &#8381;`;
    balanceDiv.appendChild(balance);

    new Button(balanceArea, {
      viewType: ButtonType.PRIMARY,
      actionType: 'button',
      innerText: 'Вывести деньги',
      clickHandler: () => {
        if (this.profileState.user.balance) {
          openWithdrawEditor();
        } else {
          notice('Вы пока ещё ничего не заработали.', 'info');
        }
      },
    }).addClassNames('balance-area__withdraw');
    div.appendChild(balanceArea);
  }

  protected onErase(): void {
    this.avatar.remove();
    this.miniStatistic.remove();
  }
}
