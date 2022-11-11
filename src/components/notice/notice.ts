import {IconButton} from '@components/icon_button/icon_button';
import closeImg from '@icon/close.svg';
import './notice.styl';

/** */
export class Notice {
  readonly element: HTMLElement;
  /**
   *
   * @param msg -
   * @param closeCallback -
   */
  constructor(msg: string, closeCallback: () => void) {
    const notice = document.createElement('div');
    notice.classList.add('notice', 'notice__back');

    const message = document.createElement('span');
    message.className = 'notice__msg';
    message.insertAdjacentText('afterbegin', msg);

    const closeBtn = new IconButton(closeImg, 'button');
    closeBtn.element.classList.add('notice__btn-close');
    closeBtn.element.addEventListener('click',
        () => {
          closeCallback();
        },
    );

    notice.append(message, closeBtn.element);
    this.element = notice;
  }
}
