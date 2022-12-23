import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import alertIcon from '@icon/alert.svg';
import './notice-bell.styl';

interface NoticeBellOptions {
  hasNewNotices: boolean;
  onClick: () => void;
}

export default class NoticeBell extends ComponentBase<'div', boolean> {
  constructor(el: HTMLElement, private options: NoticeBellOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const bell = document.createElement('div');
    bell.className = 'notice-bell';
    bell.addEventListener('click', (e) => {
      e.stopPropagation();
      this.options.onClick();
      this.update(false);
    });

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

    return bell;
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
