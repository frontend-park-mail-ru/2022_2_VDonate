import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import alertIcon from '@icon/alert.svg';
import './notice-bell.styl';
import Button, {ButtonType} from '@components/Button/Button';
import ws from '@app/WebSocketNotice';
import store from '@app/Store';
import {PayloadBackNotice} from '@actions/types/notice';
import {notice} from '@actions/handlers/notice';

interface NoticeBellOptions {
  hasNewNotices: boolean;
}

export default class NoticeBell extends ComponentBase<'div', boolean> {
  constructor(el: HTMLElement, private options: NoticeBellOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const bell = document.createElement('div');
    bell.className = 'notice-bell';

    const icon = document.createElement('img');
    icon.src = alertIcon;
    icon.className = 'notice-bell__icon';

    bell.appendChild(icon);

    const newNotices = document.createElement('div');
    newNotices.className = 'notice-bell__new-notices';
    if (this.options.hasNewNotices) {
      newNotices.classList.add('notice-bell__new-notices_active');
    }

    bell.appendChild(newNotices);

    const btnArea = document.createElement('div');
    btnArea.classList.add('notice-bell__btn-area', 'bg_sub-menu');
    bell.appendChild(btnArea);

    new Button(btnArea, {
      actionType: 'button',
      viewType: ButtonType.OUTLINE,
      innerText: 'Показать все',
      clickHandler: this.showAllNotice.bind(this),
    });
    new Button(btnArea, {
      actionType: 'button',
      viewType: ButtonType.OUTLINE,
      innerText: 'Удалить все',
      clickHandler: ws.clearAll.bind(ws),
    });

    return bell;
  }

  private showAllNotice() {
    const backNotices = store.getState().backNotice as PayloadBackNotice[];
    backNotices.forEach((backNotice) => {
      notice(backNotice.message, 'info');
    });
  }

  update(hasNewNotices: boolean): void {
    const newNotices =
      querySelectorWithThrow(this.domElement, '.notice-bell__new-notices');
    if (hasNewNotices) {
      newNotices.classList.add('notice-bell__new-notices_active');
    } else {
      newNotices.classList.remove('notice-bell__new-notices_active');
    }
  }
}
