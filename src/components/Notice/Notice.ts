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

    const message = document.createElement('span');
    message.classList.add('notice__msg', 'font_regular');
    message.insertAdjacentText('afterbegin', this.options.message);
    notice.appendChild(message);

    new Button(notice, {
      viewType: ButtonType.ICON,
      innerIcon: closeIcon,
      actionType: 'button',
      clickHandler: this.options.onDelete,
    });

    return notice;
  }

  update(data: never): void {
    return data;
  }
}


