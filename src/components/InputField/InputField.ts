import './input-field.styl';
import templateInput from './input.hbs';
import templateTextarea from './textarea.hbs';
import userIcon from '@icon/user.svg';
import emailIcon from '@icon/email.svg';
import passwordIcon from '@icon/password.svg';
import ComponentBase from '@flux/types/component';

export enum InputType {
  username,
  email,
  password,
  text,
  textarea,
  file,
  checkbox,
}

export interface InputOptions {
  kind: InputType
  label: string
  name: string
  placeholder?: string
  value?: string
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
        templateContext.withAccept = 'image/*';
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
      default: {
        const _exhaustiveCheck: never = this.options.kind;
        return _exhaustiveCheck;
      }
    }
    input.insertAdjacentHTML('beforeend', templateInput(templateContext));

    return input;
  }

  update(isError: boolean): void {
    const back = this.domElement.querySelector('.input-field__back');
    if (isError) back?.classList.add('input-field__back_error');
    else back?.classList.remove('input-field__back_error');
  }
}
