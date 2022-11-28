import store from '@app/store';
import './entry-page.styl';
import {PayloadSignUpErrors} from '@actions/types/user';
import ViewBaseExtended from '@app/view';
import LogInForm from '@components/EntryForm/LogInForm';
import SignUpForm from '@components/EntryForm/SignUpForm';
/** Перечисление типов формы входа */
export enum EntryFormType {
  LOGIN,
  SIGNUP,
}

interface LoginPageOptions {
  type: EntryFormType
}

/** Реализация интерфейса *IView* для страницы входа */
export default class EntryPage extends ViewBaseExtended<never> {
  /** Сосотояние ошибок в форме */
  private formErrors: PayloadSignUpErrors | undefined;
  private form!: LogInForm | SignUpForm;

  constructor(el: HTMLElement, private options: LoginPageOptions) {
    super();
    this.renderTo(el);
  }

  notify(): void {
    //
  }

  update(data: never): void {
    return data;
  }

  protected render(): HTMLDivElement {
    const page = document.createElement('div');
    page.className = 'entry-page';

    const contentArea = document.createElement('div');
    contentArea.className = 'entry-page__content-area';
    page.appendChild(contentArea);

    const formArea = document.createElement('div');
    formArea.className = 'entry-page__form-area';
    page.appendChild(formArea);

    const content = document.createElement('span');
    // content.innerHTML = '<i>Тут Нужен Kонтент!</i>';
    contentArea.appendChild(content);

    switch (this.options.type) {
      case EntryFormType.LOGIN:
        this.form = new LogInForm(formArea);
        break;
      case EntryFormType.SIGNUP:
        this.form = new SignUpForm(formArea);
    }

    this.formErrors = store.getState().formErrors as PayloadSignUpErrors;

    return page;
  }
}
