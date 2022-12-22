import {openProfileEditor} from '@actions/handlers/editor';
import routing from '@actions/handlers/routing';
import {logout} from '@actions/handlers/user';
import {PayloadUser} from '@actions/types/user';
import UpgradeViewBase from '@app/UpgradeView';
import Button, {ButtonType} from '@components/Button/Button';
import NoticeBell from '@components/NoticeBell/NoticeBell';
import ProfileMini, {ProfileMiniType}
  from '@components/ProfileMini/ProfileMini';
import SubMenu, {SubMenuType} from '@components/SubMenu/SubMenu';
import {clearAllBackNotice} from '@actions/handlers/backNotice';
import store from '@app/Store';
import menuIcon from '@icon/menu.svg';
import './profile-container.styl';
import {querySelectorWithThrow} from '@flux/types/component';

interface ProfileContainerOptions {
  id: number
  subMebuParent: HTMLElement
}

export default class ProfileContainer extends UpgradeViewBase {
  private profileMini!: ProfileMini;
  private noticeBell!: NoticeBell;
  private backNoticeCount: number;
  private noticeSubMenu!: SubMenu;
  private profileSubMenu!: SubMenu;
  private noticeEraseButton!: HTMLElement;

  constructor(el: HTMLElement, private options: ProfileContainerOptions) {
    super();
    this.backNoticeCount =
      (store.getState().backNotice as unknown[]).length;
    this.renderTo(el);
  }

  notify(): void {
    const user =
      store.getState().user as PayloadUser;
    this.profileMini.update({
      avatar: user.avatar,
      username: user.username,
      isAuthor: user.isAuthor,
    });

    const backNoticeCountNew =
      (store.getState().backNotice as unknown[]).length;
    if (backNoticeCountNew !== this.backNoticeCount) {
      this.backNoticeCount = backNoticeCountNew;
      if (backNoticeCountNew === 0) {
        this.noticeBell.update(false);
        this.noticeEraseButton
            .classList.add('profile-container__erase-btn_hide');
      } else {
        this.noticeBell.update(true);
        this.noticeEraseButton
            .classList.remove('profile-container__erase-btn_hide');
      }
    }
  }

  protected render(): HTMLDivElement {
    const profileContainer = document.createElement('div');
    profileContainer.classList.add('profile-container');

    this.profileMini = new ProfileMini(profileContainer, {
      username: '',
      avatar: '',
      isAuthor: false,
      id: this.options.id,
      type: ProfileMiniType.SESSION_PROFILE,
    });
    this.profileMini.addClassNames('profile-container__profile-mini');

    this.noticeSubMenu = new SubMenu(this.options.subMebuParent, {
      type: SubMenuType.NOTICE,
      buttonsOptions: [
        {
          actionType: 'button',
          viewType: ButtonType.OUTLINE,
          innerText: 'Удалить все',
          clickHandler: clearAllBackNotice,
        },
      ],
    });
    this.noticeEraseButton =
      querySelectorWithThrow(this.options.subMebuParent, '.button');

    this.profileSubMenu = new SubMenu(this.options.subMebuParent, {
      type: SubMenuType.PROFILE,
      buttonsOptions: [
        {
          viewType: ButtonType.OUTLINE,
          actionType: 'button',
          innerText: 'Профиль',
          clickHandler: () => {
            const user = store.getState().user as PayloadUser;
            routing(`/profile?id=${user.id}`);
          },
        },
        {
          viewType: ButtonType.OUTLINE,
          actionType: 'button',
          innerText: 'Изменить данные',
          clickHandler: openProfileEditor,
        },
        {
          viewType: ButtonType.OUTLINE,
          actionType: 'button',
          innerText: 'Выйти',
          clickHandler: logout,
        },
      ],
    });

    this.noticeBell = new NoticeBell(profileContainer, {
      hasNewNotices: true,
      onClick: () => {
        this.noticeSubMenu.update('toggle');
        this.profileSubMenu.update('disable');
      },
    });

    if (this.backNoticeCount > 0) {
      this.noticeBell.update(true);
    } else {
      this.noticeBell.update(false);
      this.noticeEraseButton
          .classList.add('profile-container__erase-btn_hide');
    }

    new Button(profileContainer, {
      viewType: ButtonType.ICON,
      clickHandler: () => {
        this.profileSubMenu.update('toggle');
        this.noticeSubMenu.update('disable');
      },
      actionType: 'button',
      innerIcon: menuIcon,
    });

    return profileContainer;
  }

  update(data: never): void {
    return data;
  }

  protected onErase(): void {
    this.profileMini.remove();
    this.noticeBell.remove();
  }
}
