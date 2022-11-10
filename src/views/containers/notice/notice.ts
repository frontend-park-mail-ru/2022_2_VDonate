import {Notice} from '@components/notice/notice';
import './notice.styl';
/** */
export class NoticeContainer {
  readonly element: HTMLElement;
  private notices: Set<Notice>;
  /** */
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'notice-container';
    this.notices = new Set();
  }
  /**
   *
   * @param message -
   */
  addNotice(message: string) {
    const timeoutID = setTimeout(
        () => {
          this.removeNotice(notice);
        }, 5000,
    );
    const notice = new Notice(
        message,
        () => {
          this.removeNotice(notice);
          clearTimeout(timeoutID);
        });
    this.element.insertAdjacentElement('afterbegin', notice.element);
    this.notices.add(notice);
  }
  /**
   *
   * @param target -
   */
  removeNotice(target: Notice) {
    target.element.remove();
    this.notices.delete(target);
  }
}
