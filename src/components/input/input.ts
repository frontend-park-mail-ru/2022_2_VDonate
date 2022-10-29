import './input.styl';
import input from './input.hbs';
import userIcon from '@icon/user.svg';
import emailIcon from '@icon/email.svg';
import passwordIcon from '@icon/password.svg';

export enum InputType {
  username,
  email,
  password,
}

interface InputContext {
  label: string
  placeholder: string
  name: string
}

/**
 * Компонент поля ввода
 */
export class Input {
  readonly element: HTMLLabelElement;

  /**
   * @param type тип поля ввода
   * @param context наполнение поля ввода
   */
  constructor(type: InputType, context: InputContext) {
    this.element = document.createElement('label');
    this.element.classList.add('input');
    const fullContext: InputContext & {
      type?: string
      icon?: string
    } = context;
    switch (type) {
      case InputType.username:
        fullContext.type = 'text';
        fullContext.icon = userIcon;
        break;
      case InputType.email:
        fullContext.type = 'text';
        fullContext.icon = emailIcon;
        break;
      case InputType.password:
        fullContext.type = 'password';
        fullContext.icon = passwordIcon;
        break;
      default:
        break;
    }
    this.element.innerHTML += input(fullContext);
  }

  /**
   * Метод отображения ошибки
   * @param err флаг ошибки
   */
  errorDetect(err: boolean) {
    const back = this.element.querySelector('div.input__back');
    err ?
      back?.classList.add('input__back_error') :
      back?.classList.remove('input__back_error');
  }
}
