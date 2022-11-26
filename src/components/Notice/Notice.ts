import Button, {ButtonType} from '@components/Button/Button';
import ComponentBase from '@flux/types/component';
import closeIcon from '@icon/close.svg';
import './notice.styl';

interface NoticeOptions {
  message: string
  onDelete: () => void
}

/** */
export default
class Notice extends ComponentBase<'div'> {
  constructor(el: HTMLElement, private options: NoticeOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const notice = document.createElement('div');
    notice.classList.add('notice', 'notice__back');

    const message = document.createElement('span');
    message.className = 'notice__msg';
    message.insertAdjacentText('afterbegin', this.options.message);
    notice.appendChild(message);

    const closeBtn = new Button(notice, {
      viewType: ButtonType.icon,
      innerIcon: closeIcon,
      actionType: 'button',
      clickCallback: this.options.onDelete,
    });
    closeBtn.addClassNames('notice__btn-close');

    return notice;
  }

  update(data: never): void {
    return data;
  }
}


