import {Glass, GlassType} from '@components/glass/glass';
import {Button, ButtonType} from '@components/button/button';
import {Input, InputType} from '@components/input/input';
import './signlog.styl';
import login from '@actions/handlers/login';
import {LoginForm} from '@actions/types/login';

/**
 * Вход или регистрация
 */
export enum SignLogType {
  signup,
  login,
}
const logContext = [
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

const signContext = [
  {
    inputType: InputType.email,
    context: {
      label: 'Почта',
      placeholder: 'Введите свою почту',
      name: 'email',
    },
  },
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
  {
    inputType: InputType.password,
    context: {
      label: 'Повторите пароль',
      placeholder: 'Введите свой пароль',
      name: 'passwordRepeat',
    },
  },
];

/**
 * Модель авторизации
 */
export class SignLog {
  /**
  * Актуальный контейнер авторизации
  */
  readonly element: HTMLElement;

  /**
   * @param signlog вход или регистрация
   * @param inputs поля ввода
   */
  constructor(
      signlog: SignLogType,
  ) {
    const glass = new Glass(GlassType.lines);
    this.element = glass.element;
    this.element.classList.add('signlog');
    switch (signlog) {
      case SignLogType.login:
        this.loginConstruct();
        break;
      case SignLogType.signup:
        this.signupConstruct();
        break;
      default:
        break;
    }
  }

  /**
   * Конструктор для входа
   */
  loginConstruct() {
    const form = document.createElement('form');
    this.element.innerHTML = '';
    const type = document.createElement('span');
    type.classList.add('signlog__type');
    const greets = document.createElement('span');
    greets.classList.add('signlog__greets');
    type.innerText = 'Вход';
    greets.innerText = 'Мы ждали тебя!';
    form.appendChild(type);
    form.appendChild(greets);
    logContext.forEach(({inputType, context}) => {
      const inputEl = new Input(inputType, context);
      inputEl.element.classList.add('signlog__input');
      form.appendChild(inputEl.element);
    });
    const btnArea = document.createElement('div');
    btnArea.classList.add('signlog__btn-area');
    const signlogButton = new Button(
        ButtonType.primary,
        type.innerText,
        'submit',
    );
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      login((e.target as HTMLFormElement).elements as LoginForm);
    });
    signlogButton.element.classList.add('signlog__btn-area_btn');
    const link = document.createElement('a');
    link.classList.add('signlog__btn-area_link');
    link.href = '/signup';
    link.setAttribute('data-link', '');
    link.innerHTML = `
      Ещё не с нами? Зарегистрироваться!
    `;
    btnArea.appendChild(signlogButton.element);
    btnArea.appendChild(link);
    form.appendChild(btnArea);
    this.element.appendChild(form);
  }

  /**
   * Конструктор для регистрации
   */
  signupConstruct() {
    const form = document.createElement('form');
    this.element.innerHTML = '';
    const type = document.createElement('span');
    type.classList.add('signlog__type');
    const greets = document.createElement('span');
    greets.classList.add('signlog__greets');
    type.innerText = 'Регистрация';
    greets.innerText = 'Скорее присоединяйся к нам!';
    form.appendChild(type);
    form.appendChild(greets);
    signContext.forEach(({inputType, context}) => {
      const inputEl = new Input(inputType, context);
      inputEl.element.classList.add('signlog__input');
      form.appendChild(inputEl.element);
    });
    const btnArea = document.createElement('div');
    btnArea.classList.add('signlog__btn-area');
    const signlogButton = new Button(
        ButtonType.primary,
        type.innerText,
        'submit',
    );
    form.addEventListener('click', (e) => {
      e.preventDefault();
      // TODO поменять на action signup
      login((e.target as HTMLFormElement).elements as LoginForm);
    });
    signlogButton.element.classList.add('signlog__btn-area_btn');
    const link = document.createElement('a');
    link.classList.add('signlog__btn-area_link');
    link.href = '/login';
    link.setAttribute('data-link', '');
    link.innerHTML = `
        Мне кажется, или мы знакомы? Войти
    `;
    btnArea.appendChild(signlogButton.element);
    btnArea.appendChild(link);
    form.appendChild(btnArea);
    this.element.appendChild(form);
  }
}
