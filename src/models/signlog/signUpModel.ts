import signup from '@actions/handlers/signup';
import {PayloadSignUpErrors, SignUpForm} from '@actions/types/signup';
import store from '@app/store';
import {Button, ButtonType} from '@components/button/button';
import {Input, InputType} from '@components/input/input';
import {IObserver} from '@flux/types/observer';
import template from './signlog.hbs';
import './signlog.styl';
/** Контекст для шаблона */
const signUpContext = {
  title: 'Регистрация',
  greeting: 'Скорее присоединяйся к нам!',
  link: '/login',
  textLink: 'Мне кажется, или мы знакомы? Войти',
};
/** Контекст для полей ввода */
const signUpInputs = [
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
      name: 'repeatPassword',
    },
  },
];
/** Модель формы регистрации */
export class SignUpModel implements IObserver {
  /** Актуальный контейнер регистрации */
  readonly element: HTMLFormElement;
  /** Список компонентов ввода, используемых в текущем контейнере */
  private inputs: Input[] = [];
  /** Сосотояние ошибок в форме */
  private formErrors: PayloadSignUpErrors | undefined;
  /** Конструктор */
  constructor() {
    this.element = document.createElement('form');
    this.element.classList.add('signlog', 'signlog__back');
    this.element.innerHTML = template(signUpContext);
    const inputsArea = this.element.querySelector('.signlog__inputs');
    if (inputsArea) {
      signUpInputs.forEach(({inputType, context}, idx) => {
        const input = new Input(inputType, context);
        inputsArea.appendChild(input.element);
        this.inputs[idx] = input;
      });
    }
    this.element.querySelector('.signlog__submit')?.appendChild(
        new Button(ButtonType.primary, 'Зарегистрироваться', 'submit').element,
    );

    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      signup((e.target as HTMLFormElement).elements as SignUpForm);
    });
    store.registerObserver(this);
  }
  /** Callback метод обновления хранилища */
  notify(): void {
    const formErrorsNew = store.getState().formErrors as PayloadSignUpErrors;
    if (JSON.stringify(formErrorsNew) !== JSON.stringify(this.formErrors)) {
      this.formErrors = formErrorsNew;
      this.inputs[0].errorDetect(!!this.formErrors.email);
      this.inputs[1].errorDetect(!!this.formErrors.username);
      this.inputs[2].errorDetect(!!this.formErrors.password);
      this.inputs[3].errorDetect(!!this.formErrors.repeatPassword);
    }
  }
}
