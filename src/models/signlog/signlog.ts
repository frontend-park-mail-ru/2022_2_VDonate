import {Glass, GlassType} from '@components/glass/glass';
import {Button, ButtonType} from '@components/button/button';
import {Input, InputType} from '@components/input/input';
import './signlog.styl';

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
      name: 'хз',
    },
  },
  {
    inputType: InputType.password,
    context: {
      label: 'Пароль',
      placeholder: 'Введите свой пароль',
      name: 'ххзз',
    },
  },
];

const signContext = [
  {
    inputType: InputType.email,
    context: {
      label: 'Почта',
      placeholder: 'Введите свою почту',
      name: 'хз',
    },
  },
  {
    inputType: InputType.username,
    context: {
      label: 'Псевдоним',
      placeholder: 'Введите свой псеводим',
      name: 'хз',
    },
  },
  {
    inputType: InputType.password,
    context: {
      label: 'Пароль',
      placeholder: 'Введите свой пароль',
      name: 'ххзз',
    },
  },
  {
    inputType: InputType.password,
    context: {
      label: 'Повторите пароль',
      placeholder: 'Введите свой пароль',
      name: 'ххзз',
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
    this.element.innerHTML = '';
    const type = document.createElement('span');
    type.classList.add('signlog__type');
    const greets = document.createElement('span');
    greets.classList.add('signlog__greets');
    type.innerText = 'Вход';
    greets.innerText = 'Мы ждали тебя!';
    this.element.appendChild(type);
    this.element.appendChild(greets);
    logContext.forEach(({inputType, context}) => {
      const inputEl = new Input(inputType, context);
      inputEl.element.classList.add('signlog__input');
      this.element.appendChild(inputEl.element);
    });
    const btnArea = document.createElement('div');
    btnArea.classList.add('signlog__btn-area');
    const signlogButton = new Button(
        ButtonType.primary,
        type.innerText,
        'submit',
    );
    signlogButton.element.onclick = () => {
      // TODO: вызов валиации и вход
    };
    signlogButton.element.classList.add('signlog__btn-area_btn');
    const link = document.createElement('span');
    link.classList.add('signlog__btn-area_link');
    link.innerHTML = `
      Ещё не с нами? Зарегистрироваться
    `;
    link.onclick = () => {
      this.signupConstruct();
    };
    btnArea.appendChild(signlogButton.element);
    btnArea.appendChild(link);
    this.element.appendChild(btnArea);
  }

  /**
   * Конструктор для регистрации
   */
  signupConstruct() {
    this.element.innerHTML = '';
    const type = document.createElement('span');
    type.classList.add('signlog__type');
    const greets = document.createElement('span');
    greets.classList.add('signlog__greets');
    type.innerText = 'Регистрация';
    greets.innerText = 'Скорее присоединяйся к нам!';
    this.element.appendChild(type);
    this.element.appendChild(greets);
    signContext.forEach(({inputType, context}) => {
      const inputEl = new Input(inputType, context);
      inputEl.element.classList.add('signlog__input');
      this.element.appendChild(inputEl.element);
    });
    const btnArea = document.createElement('div');
    btnArea.classList.add('signlog__btn-area');
    const signlogButton = new Button(
        ButtonType.primary,
        type.innerText,
        'submit',
    );
    signlogButton.element.onclick = () => {
      // TODO: вызов валиации и регистрация
    };
    signlogButton.element.classList.add('signlog__btn-area_btn');
    const link = document.createElement('span');
    link.classList.add('signlog__btn-area_link');
    link.innerHTML = `
        Мне кажется, или мы знакомы? Войти
    `;
    link.onclick = () => {
      this.loginConstruct();
    };
    btnArea.appendChild(signlogButton.element);
    btnArea.appendChild(link);
    this.element.appendChild(btnArea);
  }
}
