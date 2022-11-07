import login from '@actions/handlers/login';
import {LogInForm, PayloadLogInErrors} from '@actions/types/login';
import store from '@app/store';
import {Button, ButtonType} from '@components/button/button';
import {Input, InputType} from '@components/input/input';
import {IObserver} from '@flux/types/observer';
import template from './signlog.hbs';
import './signlog.styl';
/** Контекст для шаблона */
const logInContext = {
  title: 'Вход',
  greeting: 'Мы ждали тебя!',
  link: '/signup',
  textLink: 'Ещё не с нами? Зарегиструйся!',
};
/** Контекст для полей ввода */
const logInInputs = [
  {
    inputType: InputType.username,
    context: {
      label: 'Псевдоним',
      placeholder: 'Введите свой псеводим',
      name: 'username',
    },
  },
  {
    inputType: InputType.password,
    context: {
      label: 'Пароль',
      placeholder: 'Введите свой пароль',
      name: 'password',
    },
  },
];
/** Модель формы входа */
export class LogInModel implements IObserver {
  /** Актуальный контейнер авторизации */
  readonly element: HTMLFormElement;
  /** Список компонентов ввода, используемых в текущем контейнере */
  private inputs: Input[] = [];
  /** Сосотояние ошибок в форме */
  private formErrors: PayloadLogInErrors | undefined;
  /** Конструктор */
  constructor() {
    this.element = document.createElement('form');
    this.element.classList.add('signlog', 'signlog__back');
    this.element.innerHTML = template(logInContext);
    const inputsArea = this.element.querySelector('.signlog__inputs');
    if (inputsArea) {
      logInInputs.forEach(({inputType, context}, idx) => {
        const input = new Input(inputType, context);
        inputsArea.appendChild(input.element);
        this.inputs[idx] = input;
      });
    }
    this.element.querySelector('.signlog__submit')?.appendChild(
        new Button(ButtonType.primary, 'Войти', 'submit').element,
    );

    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      login((e.target as HTMLFormElement).elements as LogInForm);
    });
    store.registerObserver(this);
  }
  /** Callback метод обновления хранилища */
  notify(): void {
    const formErrorsNew = store.getState().formErrors as PayloadLogInErrors;
    if (JSON.stringify(formErrorsNew) !== JSON.stringify(this.formErrors)) {
      this.formErrors = formErrorsNew;
      this.inputs[0].errorDetect(!!this.formErrors.username);
      this.inputs[1].errorDetect(!!this.formErrors.password);
    }
  }
}
