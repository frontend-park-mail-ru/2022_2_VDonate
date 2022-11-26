import {PayloadNotice} from '@actions/types/notice';
import store from '@app/store';
import ViewBaseExtended from '@app/view';
import Notice from '@components/Notice/Notice';
import './notice.styl';
/** */
export default class NoticeContainer extends ViewBaseExtended<string> {
  private notices = new Set<Notice>();
  private noticeState?: PayloadNotice;

  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
    this.notify();
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
