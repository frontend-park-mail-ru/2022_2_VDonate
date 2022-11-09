import {IconButton} from '@components/icon_button/icon_button';
import closeImg from '@icon/plus.svg';


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
    closeBtn.element.className += 'notice__btn_close';
    closeBtn.element.addEventListener('click',
        () => {
          closeCallback();
        },
    );

    this.element = notice;
  }
}
