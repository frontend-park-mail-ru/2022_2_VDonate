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
  textLink: 'Ещё не с нами? Зарегиструйся!',
};
/** Контекст для полей ввода */
const logInInputs: InputOptions[] = [
  {
    kind: InputType.username,
    label: 'Псевдоним',
    placeholder: 'Введите свой псеводим',
    name: 'username',
  },
  {
    kind: InputType.password,
    label: 'Пароль',
    placeholder: 'Введите свой пароль',
    name: 'password',
  },
];

type LogInInputsErrors = Map<'username' | 'password', boolean>;

/** Модель формы входа */
export default
class LogInForm
  extends ComponentBase<'form', LogInInputsErrors> {
  /** Список компонентов ввода, используемых в текущем контейнере */
  private inputs = new Map<string, InputField>();

  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
  }

  update(errors: LogInInputsErrors): void {
    errors.forEach((isError, name) => {
      this.inputs.get(name)?.update(isError);
    });
  }

  protected render(): HTMLFormElement {
    const form = document.createElement('form');
    form.classList.add('signlog', 'signlog__back');
    form.innerHTML = template(logInContext);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      login((e.target as HTMLFormElement).elements as LogInFormElements);
    });

    const inputsArea = querySelectorWithThrow(form, '.signlog__inputs');
    logInInputs.forEach((options) =>
      this.inputs.set(options.name, new InputField(inputsArea, options)));

    new Button(querySelectorWithThrow(form, '.signlog__submit'), {
      actionType: 'submit',
      innerText: 'Войти',
      viewType: ButtonType.PRIMARY,
    });

    return form;
  }
}
