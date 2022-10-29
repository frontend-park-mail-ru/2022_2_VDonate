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

interface InputData {
  inputType: InputType,
  context: {
    label: string,
    placeholder: string,
    name: string,
  }
}

/**
 * Модель авторизации
 */
export class SignLog {
  /**
  * Актуальный контейнер авторизации
  */
  readonly element : HTMLElement;

  /**
   * @param signlog вход или регистрация
   * @param inputs поля ввода
   */
  constructor(
      signlog: SignLogType,
      inputs: InputData[],
  ) {
    const glass = new Glass(GlassType.lines);
    this.element = glass.element;
    this.element.classList.add('signlog');
    const type = document.createElement('span');
    type.classList.add('signlog__type');
    const greets = document.createElement('span');
    greets.classList.add('signlog__greets');
    switch (signlog) {
      case SignLogType.login:
        type.innerText = 'Вход';
        greets.innerText = 'Мы ждали тебя!';
        break;
      case SignLogType.signup:
        type.innerText = 'регистрация';
        greets.innerText = 'Скорее присоединяйся к нам!';
        break;
      default:
        break;
    }
    this.element.appendChild(type);
    this.element.appendChild(greets);
    inputs.forEach(({inputType, context}) => {
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
    signlogButton.element.classList.add('signlog__btn-area_btn');
    const link = document.createElement('span');
    link.classList.add('signlog__btn-area_link');
    switch (signlog) {
      case SignLogType.login:
        link.innerHTML = `
          Ещё не с нами? <a href="/signup">Зарегистрироваться</a>
        `;
        break;
      case SignLogType.signup:
        link.innerHTML = `
        Мне кажется, или мы знакомы? <a href="/login">Войти</a>
        `;
        break;
      default:
        break;
    }
    btnArea.appendChild(signlogButton.element);
    btnArea.appendChild(link);
    this.element.appendChild(btnArea);
  }
}
