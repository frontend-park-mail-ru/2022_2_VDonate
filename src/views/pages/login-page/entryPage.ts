import store from '@app/store';
import {IView} from '@flux/types/view';
import {IObserver} from '@flux/types/observer';
import {SignLog, SignLogType} from '@models/signlog/signlog';
import './entryPage.styl';
/** Тип структорного представления страницы из компонентов */
interface LoginModel {
  root: HTMLDivElement
  children: {
    content: {
      el: HTMLDivElement
      children: HTMLSpanElement
    }
    form: {
      el: HTMLDivElement
      children: SignLog
    }
  }
}
/** Реализация интерфейса *IView* для страницы входа */
export default class LoginPage implements IView, IObserver {
  /** Структорное представление страницы из компонентов */
  private page: LoginModel;
  /**
   * Конструктор
   * @param type - тип страницы входа
   */
  constructor(type: SignLogType) {
    const root = document.createElement('div');
    root.className = 'entry-page';

    const contentArea = document.createElement('div');
    contentArea.className = 'entry-page__content-area';
    root.appendChild(contentArea);

    const formArea = document.createElement('div');
    formArea.className = 'entry-page__form-area';
    root.appendChild(formArea);

    const content = document.createElement('span');
    content.innerHTML = '<i>Тут Нужен Kонтент!</i>';
    contentArea.appendChild(content);

    const form = new SignLog(type);
    formArea.appendChild(form.element);

    this.page = {
      root,
      children: {
        content: {
          el: contentArea,
          children: content,
        },
        form: {
          el: formArea,
          children: form,
        },
      },
    };
    store.registerObserver(this);
  }
  /** Оповещение об изменением хранилища */
  notify(): void {
    this.rerender();
  }
  /** Сброс страницы, отключение от хранилища */
  reset(): void {
    store.removeObserver(this);
    this.page.root.remove();
  }
  /**
   * Создание страницы входа
   * @returns Страница-элемент
   */
  render(): HTMLElement {
    return this.page.root;
  }
  /** Перерисовка страницы по текущему состоянию хранилища */
  rerender(): void {}// eslint-disable-line @typescript-eslint/no-empty-function
}
