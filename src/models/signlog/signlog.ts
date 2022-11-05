import {Button, ButtonType} from '@components/button/button';
import {Input, InputType} from '@components/input/input';
import './signlog.styl';
import login from '@actions/handlers/login';
import {LogInForm} from '@actions/types/login';
import signup from '@actions/handlers/signup';
import {SignUpForm} from '@actions/types/signup';

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
      placeholder: 'Для нашего личного общения',
      name: 'email',
    },
  },
  {
    inputType: InputType.username,
    context: {
      label: 'Псевдоним',
      placeholder: 'Ваше уникальное имя',
      name: 'username',
    },
  },
  {
    inputType: InputType.password,
    context: {
      label: 'Пароль',
      placeholder: 'Мы обещаем не продавать его',
      name: 'password',
    },
  },
  {
    inputType: InputType.password,
    context: {
      label: 'Повторите пароль',
      placeholder: 'Чтобы точно',
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
    const form = document.createElement('form');
    const title = document.createElement('span');
    const greets = document.createElement('span');
    const btnArea = document.createElement('div');
    const link = document.createElement('a');
    const submitBtn = new Button(ButtonType.primary, '', 'submit');

    form.classList.add('signlog', 'signlog__back');
    title.classList.add('signlog__type');
    greets.classList.add('signlog__greets');
    btnArea.classList.add('signlog__btn-area');
    btnArea.appendChild(submitBtn.element);
    btnArea.appendChild(link);
    submitBtn.element.classList.add('signlog__btn-area_btn');
    link.classList.add('signlog__btn-area_link');
    link.setAttribute('data-link', '');

    form.appendChild(title);
    form.appendChild(greets);

    switch (signlog) {
      case SignLogType.login:
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          login((e.target as HTMLFormElement).elements as LogInForm);
        });

        title.innerText = 'Вход';
        greets.innerText = 'Мы ждали тебя!';
        logContext.forEach(({inputType, context}) => {
          const inputEl = new Input(inputType, context);
          inputEl.element.classList.add('signlog__input');
          form.appendChild(inputEl.element);
        });
        submitBtn.changeText('Войти');
        link.href = '/signup';
        link.innerHTML = 'Ещё не с нами? <b>Зарегистрироваться!</b>';
        break;
      case SignLogType.signup:
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          signup((e.target as HTMLFormElement).elements as SignUpForm);
        });

        title.innerText = 'Регистрация';
        greets.innerText = 'Скорее присоединяйся к нам!';
        signContext.forEach(({inputType, context}) => {
          const inputEl = new Input(inputType, context);
          inputEl.element.classList.add('signlog__input');
          form.appendChild(inputEl.element);
        });
        submitBtn.changeText('Зарегистрироваться');
        link.href = '/login';
        link.innerHTML = 'Мне кажется, или мы знакомы? <b>Войти</b>';
        break;
      default:
        break;
    }

    form.appendChild(btnArea);
    this.element = form;
  }
}
