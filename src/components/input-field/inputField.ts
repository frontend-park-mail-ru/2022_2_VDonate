import './input.styl';
import templateInput from './input.hbs';
import templateTextarea from './textarea.hbs';
import userIcon from '@icon/user.svg';
import emailIcon from '@icon/email.svg';
import passwordIcon from '@icon/password.svg';

export enum InputType {
  username,
  email,
  password,
  text,
  textarea,
  file,
  checkbox,
}

interface InputContext {
  label: string
  name: string
  placeholder?: string
  value?: string
}

/**
 * Компонент поля ввода
 */
export class InputField {
  readonly element: HTMLLabelElement;

  /**
   * @param type тип поля ввода
   * @param context наполнение поля ввода
   */
  constructor(type: InputType, context: InputContext) {
    this.element = document.createElement('label');
    this.element.classList.add('input-field');

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
      case InputType.text:
        fullContext.type = 'text';
        break;
      case InputType.file:
        fullContext.type = 'file';
        break;
      case InputType.checkbox:
        fullContext.type = 'checkbox';
        break;
      case InputType.textarea:
        this.element.insertAdjacentHTML(
            'afterbegin',
            templateTextarea(context),
        );
        return;
      default: {
        const _exhaustiveCheck: never = type;
        return _exhaustiveCheck;
      }
    }
    this.element.insertAdjacentHTML('beforeend', templateInput(fullContext));
  }

  /**
   * Метод отображения ошибки
   * @param err флаг ошибки
   */
  errorDetect(err: boolean) {
    const back = this.element.querySelector('div.input-field__back');
    err ?
      back?.classList.add('input-field__back_error') :
      back?.classList.remove('input-field__back_error');
  }
}
