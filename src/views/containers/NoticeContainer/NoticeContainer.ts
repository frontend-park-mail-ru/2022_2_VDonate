import {PayloadNotice} from '@actions/types/notice';
import store from '@app/Store';
import Notice from '@components/Notice/Notice';
import './notice-container.styl';
import routing from '@actions/handlers/routing';
import UpgradeViewBase from '@app/UpgradeView';
/** */
export default class NoticeContainer extends UpgradeViewBase {
  private notices = new Set<Notice>();
  private noticeState: PayloadNotice;

  constructor(el: HTMLElement) {
    super();
    this.noticeState = store.getState().notice as PayloadNotice;
    this.renderTo(el);
    this.notify();
  }

  protected render(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'notice-container notice-container__notice';

    return container;
  }

  notify(): void {
    const noticeStateNew = store.getState().notice as PayloadNotice;
    if (this.noticeState.timestamp !== noticeStateNew.timestamp) {
      this.noticeState = noticeStateNew;
      if (typeof this.noticeState.message === 'string') {
        if (this.noticeState.message == 'no existing session') {
          routing('/login');
          this.addNewNotice('Ошибка авторизации');
        } else if (/^[а-яёА-ЯЁ]/.test(this.noticeState.message)) {
          this.addNewNotice(this.noticeState.message);
        } else {
          this.addNewNotice('АХТУНГ! Всё идет не по плану ☆(＃××)');
          console.error(this.noticeState.message);
        }
      } else
      if (Array.isArray(this.noticeState.message)) {
        this.noticeState.message.forEach(
            (message) => {
              if (message == 'no existing session') {
                routing('/login');
                this.addNewNotice('Ошибка авторизации');
              } else if (/^[а-яёА-ЯЁ]/.test(message)) {
                this.addNewNotice(message);
              }
            },
        );
      } else
      if (this.noticeState.message instanceof Error) {
        this.addNewNotice('АХТУНГ! Всё идет не по плану ☆(＃××)');
        console.error(this.noticeState.message);
      }
    }
  }

  protected onErase(): void {
    return;
  }

  private addNewNotice(message: string) {
    const timeoutID = setTimeout(
        () => {
          this.removeNotice(notice);
        }, 10000,
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
