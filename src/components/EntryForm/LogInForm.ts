import {login, LogInFormElements} from '@actions/handlers/user';
import Button, {ButtonType} from '@components/Button/Button';
import InputField, {
  InputOptions,
  InputType,
} from '@components/InputField/InputField';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import template from './entry-form.hbs';
import './entry-form.styl';
/** Контекст для шаблона */
const logInContext = {
  title: 'Вход',
  greeting: 'Мы ждали тебя!',
  link: '/signup',
  textLink: 'Ещё не с нами? Зарегистрируйся!',
};
/** Контекст для полей ввода */
const logInInputs: InputOptions[] = [
  {
    kind: InputType.USERNAME,
    label: 'Псевдоним',
    placeholder: 'Введите свой псеводим',
    name: 'username',
    displayError: false,
    title: 'Псевдоним должен содержать не менее 3 символов',
  },
  {
    kind: InputType.PASSWORD,
    label: 'Пароль',
    placeholder: 'Введите свой пароль',
    name: 'password',
    displayError: false,
    title: 'Пароль должен содержать не менее 5 символов',
  },
];

interface LogInFormUpdateContent {
  username: boolean
  password: boolean
}

/** Модель формы входа */
export default
class LogInForm
  extends ComponentBase<'form', LogInFormUpdateContent> {
  /** Список компонентов ввода, используемых в текущем контейнере */
  private inputs = new Map<string, InputField>();

  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
  }

  update(errors: LogInFormUpdateContent): void {
    Object.entries(errors).forEach(([name, value]) => {
      this.inputs.get(name)?.update(value as boolean);
    });
  }

  protected render(): HTMLFormElement {
    const form = document.createElement('form');
    form.classList.add('entry-form', 'entry-form__back', 'bg_interaction');
    form.innerHTML = template(logInContext);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      login((e.target as HTMLFormElement).elements as LogInFormElements);
    });

    const inputsArea = querySelectorWithThrow(form, '.entry-form__inputs');
    logInInputs.forEach((options) =>
      this.inputs.set(options.name, new InputField(inputsArea, options)));

    querySelectorWithThrow(form, 'input[name="username"]')
        .setAttribute('autofocus', 'true');

    new Button(querySelectorWithThrow(form, '.entry-form__submit'), {
      actionType: 'submit',
      innerText: 'Войти',
      viewType: ButtonType.PRIMARY,
    });

    return form;
  }
}
