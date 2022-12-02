import store from '@app/Store';
import './entry-page.styl';
import LogInForm from '@components/EntryForm/LogInForm';
import SignUpForm from '@components/EntryForm/SignUpForm';
import PageBase from '@app/Page';
import {FormErrorType, PayloadFormError} from '@actions/types/formError';
import Logo from '@components/Logo/Logo';
/** Перечисление типов формы входа */
export enum EntryFormType {
  LOGIN,
  SIGNUP,
}

interface LoginPageOptions {
  type: EntryFormType
}

/** Реализация интерфейса *IView* для страницы входа */
export default class EntryPage extends PageBase {
  /** Сосотояние ошибок в форме */
  private formErrorsState: PayloadFormError;
  private form!: LogInForm | SignUpForm;

  constructor(el: HTMLElement, private options: LoginPageOptions) {
    super();
    this.renderTo(el);
  }

  notify(): void {
    const formErrorsNew = store.getState().formErrors as PayloadFormError;
    if (JSON.stringify(formErrorsNew) !==
      JSON.stringify(this.formErrorsState)) {
      this.formErrorsState = formErrorsNew;
      this.updateFormErrors();
    }
  }

  private updateFormErrors() {
    switch (this.formErrorsState?.type) {
      case FormErrorType.LOGIN:
        if (this.form instanceof LogInForm) {
          this.form.update({
            password: Boolean(this.formErrorsState.password),
            username: Boolean(this.formErrorsState.username),
          });
        }
        break;
      case FormErrorType.SIGNUP:
        if (this.form instanceof SignUpForm) {
          this.form.update({
            email: Boolean(this.formErrorsState.email),
            username: Boolean(this.formErrorsState.username),
            password: Boolean(this.formErrorsState.password),
            repeatPassword: Boolean(this.formErrorsState.repeatPassword),
          });
        }
        break;
      default:
        break;
    }
  }

  protected render(): HTMLDivElement {
    const page = document.createElement('div');
    page.className = 'entry-page entry-page__entry-page';

    const contentArea = document.createElement('div');
    contentArea.className = 'entry-page__content-area';
    new Logo(contentArea).addClassNames('entry-page__logo');
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

    return page;
  }

  protected onErase(): void {
    return;
  }
}
