import store from '@app/Store';
import './entry-page.styl';
import LogInForm from '@components/EntryForm/LogInForm';
import SignUpForm from '@components/EntryForm/SignUpForm';
import {FormErrorType, PayloadFormError} from '@actions/types/formError';
import Logo from '@components/Logo/Logo';
import UpgradeViewBase from '@app/UpgradeView';
/** Перечисление типов формы входа */
export enum EntryFormType {
  LOGIN,
  SIGNUP,
}

interface LoginPageOptions {
  type: EntryFormType
}

/** Реализация интерфейса *IView* для страницы входа */
export default class EntryPage extends UpgradeViewBase {
  /** Состояние ошибок в форме */
  // private formErrorsState: PayloadFormError;
  private form!: LogInForm | SignUpForm;

  constructor(el: HTMLElement, private options: LoginPageOptions) {
    super();
    this.renderTo(el);
  }

  notify(): void {
    const formErrors =
      store.getState().formErrors as PayloadFormError | undefined;
    switch (formErrors?.type) {
      case FormErrorType.LOGIN:
        if (this.form instanceof LogInForm) {
          this.form.update({
            password: Boolean(formErrors.password),
            username: Boolean(formErrors.username),
          });
        }
        break;
      case FormErrorType.SIGNUP:
        if (this.form instanceof SignUpForm) {
          this.form.update({
            email: Boolean(formErrors.email),
            username: Boolean(formErrors.username),
            password: Boolean(formErrors.password),
            repeatPassword: Boolean(formErrors.repeatPassword),
          });
        }
        break;
      default:
        break;
    }
  }

  protected render(): HTMLDivElement {
    const page = document.createElement('div');
    page.className = 'entry-page';

    new Logo(page).addClassNames('entry-page__logo');

    const contentArea = document.createElement('div');
    contentArea.classList.add(
        'entry-page__content-area',
        'bg_main',
        'font_regular',
    );
    contentArea.innerText =
      `ВДонате — сервис для монетизации цифрового контента.
      Поддержите любимого автора, покупая его контент,
      и подписывайтесь на его профиль.
      Также можно создать свой профиль
      и начать зарабатывать на своем контенте! \n
      © GitHub, Copilot`;

    page.appendChild(contentArea);

    const formArea = document.createElement('div');
    formArea.className = 'entry-page__form-area';
    page.appendChild(formArea);

    const content = document.createElement('span');
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
