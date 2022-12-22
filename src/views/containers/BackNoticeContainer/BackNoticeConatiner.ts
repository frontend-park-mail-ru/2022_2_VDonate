import UpgradeViewBase from '@app/UpgradeView';
import store from '@app/Store';
import {PayloadBackNotice, PaymentStatus} from '@actions/types/backNotice';
import './back-notice-container.styl';

export default class BackNoticeContainer extends UpgradeViewBase {
  private backNoticeState: PayloadBackNotice[];

  constructor(el: HTMLElement) {
    super();
    this.backNoticeState =
              store.getState().backNotice as PayloadBackNotice[];
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const backNoticeContainer = document.createElement('div');
    backNoticeContainer.classList.add('back-notice-container');
    this.backNoticeState.forEach((backNotice, idx) => {
      this.addNotice(
          backNoticeContainer,
          idx === this.backNoticeState.length - 1,
          backNotice,
      );
    });
    return backNoticeContainer;
  }

  notify(): void {
    const backNoticesNew =
      store.getState().backNotice as PayloadBackNotice[];
    if (backNoticesNew.length === 0) {
      this.domElement.replaceChildren();
      const text = document.createElement('span');
      text.classList.add('back-notice-container__empty', 'font_regular');
      text.innerText = 'Новых уведомлений нет.';
      this.domElement.appendChild(text);
    } else if (backNoticesNew.length > this.backNoticeState.length) {
      this.domElement.querySelector('.back-notice-container__empty')?.remove();
      for (
        let idx = this.backNoticeState.length;
        idx < backNoticesNew.length;
        idx++
      ) {
        this.addNotice(
            this.domElement,
            idx === backNoticesNew.length - 1,
            backNoticesNew[idx],
        );
      }
    }
    this.backNoticeState = Array.from(backNoticesNew);
  }

  private addNotice(
      el: HTMLElement,
      isLast: boolean,
      noticeContext: PayloadBackNotice,
  ): HTMLDivElement {
    const notice = document.createElement('div');
    notice.classList.add('back-notice-container__notice', 'font_regular');
    el.appendChild(notice);

    const color = document.createElement('div');
    color.classList.add('back-notice-container__color');
    notice.appendChild(color);

    const text = document.createElement('span');
    text.classList.add('back-notice-container__notice', 'font_regular');
    notice.appendChild(text);
    switch (noticeContext.name) {
      case 'like':
        text.innerText = `Пользователь ${noticeContext.data.username} 
        оценил ваш пост.`;
        color.classList.add('back-notice-container__color_info');
        break;
      case 'post':
        text.innerText = `Пользователь ${noticeContext.data.author_name} 
        опубликовал пост.`;
        color.classList.add('back-notice-container__color_info');
        break;
      case 'subscriber':
        text.innerText =
          `Пользователь ${noticeContext.data.subscriberName} 
            подписался на вас.`;
        color.classList.add('back-notice-container__color_info');
        break;
      case 'payment':
        switch (noticeContext.data.status) {
          case PaymentStatus.SUCCESS:
            text.innerText = 'Оплата прошла успешно.';
            color.classList.add('back-notice-container__color_success');
            break;
          case PaymentStatus.FAIL:
            text.innerText = 'Оплата не выполнена. Повторите попытку.';
            color.classList.add('back-notice-container__color_error');
            break;
          case PaymentStatus.TIMEOUT:
            text.innerText = 'Время ожидания оплаты вышло. Повторите попытку.';
            color.classList.add('back-notice-container__color_error');
            break;
          default:
            text.innerText = 'С оплатой что-то пошло не так. Напишите нам.';
            color.classList.add('back-notice-container__color_error');
            break;
        }
        break;
      default:
        text.innerText = 'Это уведомление неизвестно. Напишите нам.';
        color.classList.add('back-notice-container__color_error');
        break;
    }

    if (!isLast) {
      const separator = document.createElement('hr');
      separator.classList.add('back-notice-container__separator', 'bg_hr');
      el.appendChild(separator);
    }

    return notice;
  }

  protected onErase(): void {
    // TODO: реализовать уведомления
  }
}
