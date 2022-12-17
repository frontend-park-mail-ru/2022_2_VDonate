import './input-field.styl';
import templateInput from './input-field.hbs';
import templateTextarea from './textarea-input.hbs';
import userIcon from '@icon/user.svg';
import emailIcon from '@icon/email.svg';
import passwordIcon from '@icon/password.svg';
import rubleIcon from '@icon/ruble.svg';

import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';

export enum InputType {
  USERNAME,
  EMAIL,
  PASSWORD,
  TEXT,
  TEXTAREA,
  IMAGE,
  PRICE,
}

export interface InputOptions {
  kind: InputType
  label?: string
  name: string
  placeholder?: string
  value?: string
  displayError: boolean
}

/**
 * Компонент поля ввода
 */
export default
class InputField extends ComponentBase<'label', boolean> {
  constructor(element: HTMLElement, private options: InputOptions) {
    super();
    this.renderTo(element);
  }

  update(isError: boolean): void {
    if (this.options.displayError === isError) return;
    this.options.displayError = isError;
    const back = querySelectorWithThrow(this.domElement, '.input-field__back');
    if (this.options.displayError) {
      back.classList.add('input-field__back_error');
    } else {
      back.classList.remove('input-field__back_error');
    }
  }

  protected render(): HTMLLabelElement {
    const input = document.createElement('label');
    input.classList.add('input-field', 'input-field__label', 'font_regular');
    input.innerText = this.options.label ?? '';


    const templateContext: {
      label?: string
      name: string
      placeholder?: string
      value?: string
      type?: string
      icon?: string
    } = {
      ...this.options,
    };

    switch (this.options.kind) {
      case InputType.USERNAME:
        templateContext.type = 'text';
        templateContext.icon = userIcon;
        break;
      case InputType.EMAIL:
        templateContext.type = 'text';
        templateContext.icon = emailIcon;
        break;
      case InputType.PASSWORD:
        templateContext.type = 'password';
        templateContext.icon = passwordIcon;
        break;
      case InputType.TEXT:
        templateContext.type = 'text';
        break;
      case InputType.IMAGE:
        templateContext.type = 'file';
        break;
      case InputType.TEXTAREA:
        input.classList.add('input-field_with-textarea');
        templateContext.type = 'textarea';
        break;
      case InputType.PRICE:
        templateContext.type = 'number';
        templateContext.icon = rubleIcon;
        break;
      default: {
        const _exhaustiveCheck: never = this.options.kind;
        return _exhaustiveCheck;
      }
    }

    if (this.options.kind === InputType.TEXTAREA) {
      input.insertAdjacentHTML('beforeend', templateTextarea(templateContext));
    } else {
      input.insertAdjacentHTML('beforeend', templateInput(templateContext));
    }

    switch (this.options.kind) {
      case InputType.IMAGE: {
        const inputEl =
          querySelectorWithThrow(
              input, '.input-field__input',
          ) as HTMLInputElement;
        inputEl.accept = 'image/*';
        break;
      }
      case InputType.PRICE: {
        const inputEl =
          querySelectorWithThrow(
              input, '.input-field__input',
          ) as HTMLInputElement;
        inputEl.min = '1';
        break;
      }
      default:
        break;
    }

    return input;
  }
}
