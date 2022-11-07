import store from '@app/store';
import {IView} from '@flux/types/view';
import {IObserver} from '@flux/types/observer';
import './entryPage.styl';
import {PayloadSignUpErrors} from '@actions/types/signup';
import {SignUpModel} from '@models/signlog/signUpModel';
import {LogInModel} from '@models/signlog/logInModel';
/** Перечисление типов формы входа */
export enum EntryFormType {
  logIn,
  signUp
}
/** Тип структорного представления страницы из компонентов */
interface LoginModel {
  base: HTMLDivElement
  children: {
    content: {
      el: HTMLDivElement
      children: HTMLSpanElement
    }
    form: {
      el: HTMLDivElement
      children: LogInModel | SignUpModel
    }
  }
}
/** Реализация интерфейса *IView* для страницы входа */
export default class LoginPage implements IView, IObserver {
  /** Структорное представление страницы из компонентов */
  private page: LoginModel;
  /** Сосотояние ошибок в форме */
  private formErrors: PayloadSignUpErrors | undefined;
  /**
   * Конструктор
   * @param type - тип страницы входа
   */
  constructor(type: EntryFormType) {
    const base = document.createElement('div');
    base.className = 'entry-page';

    const contentArea = document.createElement('div');
    contentArea.className = 'entry-page__content-area';
    base.appendChild(contentArea);

    const formArea = document.createElement('div');
    formArea.className = 'entry-page__form-area';
    base.appendChild(formArea);

    const content = document.createElement('span');
    content.innerHTML = '<i>Тут Нужен Kонтент!</i>';
    contentArea.appendChild(content);

    let form: LogInModel | SignUpModel;
    switch (type) {
      case EntryFormType.logIn:
        form = new LogInModel();
        break;
      case EntryFormType.signUp:
        form = new SignUpModel();
    }
    formArea.appendChild(form.element);

    this.page = {
      base: base,
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
    this.formErrors = store.getState().formErrors as PayloadSignUpErrors;
    store.registerObserver(this);
  }
  /** Оповещение об изменением хранилища */
  notify(): void {
    const formErrorsNew = store.getState().formErrors as PayloadSignUpErrors;
    if (JSON.stringify(formErrorsNew) !== JSON.stringify(this.formErrors)) {
      this.formErrors = formErrorsNew;
      this.rerender();
    }
  }
  /** Сброс страницы, отключение от хранилища */
  reset(): void {
    store.removeObserver(this);
    this.page.base.remove();
  }
  /**
   * Создание страницы входа
   * @returns Страница-элемент
   */
  render(): HTMLElement {
    return this.page.base;
  }
  /** Перерисовка страницы по текущему состоянию хранилища */
  rerender(): void {
    console.warn(this.formErrors);
  }
}
