import {PayloadNotice} from '@actions/types/notice';
import store from '@app/store';
import Notice from '@components/Notice/Notice';
import ViewBase from '@flux/types/view';
import './notice.styl';
/** */
export default class NoticeContainer extends ViewBase<string> {
  private notices = new Set<Notice>();
  private noticeState?: PayloadNotice;

  constructor(element: HTMLElement) {
    super(element);
    this.notify();
    store.registerObserver(this);
  }
  erase(): void {
    store.removeObserver(this);
    this.remove();
  }
  protected render(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'notice-container';

    return container;
  }
  notify(): void {
    const noticeStateNew = store.getState().notice as PayloadNotice;
    if (JSON.stringify(noticeStateNew) !== JSON.stringify(this.noticeState)) {
      this.noticeState = noticeStateNew;
      if (typeof this.noticeState.message === 'string' &&
        /^[а-яёА-ЯЁ]/.test(this.noticeState.message)) {
        this.update(this.noticeState.message);
      }
      if (Array.isArray(this.noticeState.message)) {
        this.noticeState.message.forEach(
            (message) => this.update(message),
        );
      }
    }
  }
  update(message: string) {
    const timeoutID = setTimeout(
        () => {
          this.removeNotice(notice);
        }, 5000,
    );
    const notice = new Notice(this.domElement, {
      message,
      onDelete: () => {
        this.removeNotice(notice);
        clearTimeout(timeoutID);
      },
    });
    this.notices.add(notice);
  }
  private removeNotice(target: Notice) {
    target.remove();
    this.notices.delete(target);
  }
}
