import './input-field.styl';
import templateInput from './input.hbs';
import templateTextarea from './textarea.hbs';
import userIcon from '@icon/user.svg';
import emailIcon from '@icon/email.svg';
import passwordIcon from '@icon/password.svg';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';

export enum InputType {
  username,
  email,
  password,
  text,
  textarea,
  file,
  checkbox,
  number,
}

export interface InputOptions {
  kind: InputType
  label: string
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

  render(): HTMLLabelElement {
    const input = document.createElement('label');
    input.classList.add('input-field');

    const templateContext: {
      label: string
      name: string
      placeholder?: string
      value?: string
      type?: string
      icon?: string
      withAccept?: string
    } = {
      ...this.options,
    };

    switch (this.options.kind) {
      case InputType.username:
        templateContext.type = 'text';
        templateContext.icon = userIcon;
        break;
      case InputType.email:
        templateContext.type = 'text';
        templateContext.icon = emailIcon;
        break;
      case InputType.password:
        templateContext.type = 'password';
        templateContext.icon = passwordIcon;
        break;
      case InputType.text:
        templateContext.type = 'text';
        break;
      case InputType.file:
        templateContext.type = 'file';
        templateContext.withAccept = 'image/jpeg';
        break;
      case InputType.checkbox:
        templateContext.type = 'checkbox';
        break;
      case InputType.textarea:
        input.classList.add('input-field_with-textarea');
        input.insertAdjacentHTML(
            'afterbegin',
            templateTextarea(this.options),
        );
        return input;
      case InputType.number:
        templateContext.type = 'number';
        break;
      default: {
        const _exhaustiveCheck: never = this.options.kind;
        return _exhaustiveCheck;
      }
    }
    input.insertAdjacentHTML('beforeend', templateInput(templateContext));

    return input;
  }
}
