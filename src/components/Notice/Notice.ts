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
    notice.classList.add('notice', 'notice__back', 'bg_notice');

    const head = document.createElement('div');
    head.classList.add('notice__head');
    notice.appendChild(head);

    const message = document.createElement('span');
    message.classList.add('notice__msg', 'font_regular');
    message.insertAdjacentText('afterbegin', this.options.message);
    notice.appendChild(message);

    const closeBtn = new Button(notice, {
      viewType: ButtonType.ICON,
      innerIcon: closeIcon,
      actionType: 'button',
      clickHandler: this.options.onDelete,
    });
    closeBtn.addClassNames('notice__btn-close');

    return notice;
  }

  update(data: never): void {
    return data;
  }
}


