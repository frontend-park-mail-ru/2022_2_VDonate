import ComponentBase from '@flux/types/component';
import './button.styl';
import './icon_button.styl';

/**
 * Перчисление типов кнопок
 */
export enum ButtonType {
  primary,
  outline,
  fingers,
  icon,
}

interface SimpleButtonOptions {
  viewType:
    | ButtonType.primary
    | ButtonType.outline
    | ButtonType.fingers
  innerText: string
  actionType: 'submit' | 'button'
  clickCallback?: () => void
}

interface IconButtonOptions {
  viewType: ButtonType.icon
  innerIcon: string
  actionType: 'button'
  clickCallback: () => void
}

type ButtonOptions = SimpleButtonOptions | IconButtonOptions

/**
 * Компонент кнопка
 */
export default class Button extends ComponentBase<'button', string> {
  constructor(el: HTMLElement, private options: ButtonOptions) {
    super();
    this.renderTo(el);
  }

  update(text: string): void {
    this.domElement.getElementsByClassName('button__text')[0]
        .textContent = text;
  }

  protected render(): HTMLButtonElement {
    const button = document.createElement('button');
    button.setAttribute('type', this.options.actionType);
    if (this.options.clickCallback) {
      button.addEventListener('click', this.options.clickCallback);
    }

    if (this.options.viewType === ButtonType.icon) {
      button.classList.add(
          'icon-button',
          'icon-button__back',
          'icon-button__back_fing',
      );
      const innerIcon = document.createElement('img');
      innerIcon.className = 'icon-button__icon';
      innerIcon.src = this.options.innerIcon;
      button.appendChild(innerIcon);
      return button;
    }

    button.classList.add(
        'button',
        'button__back');
    switch (this.options.viewType) {
      case ButtonType.primary:
        button.classList.add('button__back_primary');
        break;
      case ButtonType.outline:
        button.classList.add('button__back_outline');
        break;
      case ButtonType.fingers:
        button.classList.add('button__back_fingers');
        break;
      default: {
        const _: never = this.options;
        return _;
      }
    }
    const innerText = document.createElement('span');
    innerText.classList.add('button__text');
    innerText.textContent = this.options.innerText;
    button.appendChild(innerText);

    return button;
  }
}
