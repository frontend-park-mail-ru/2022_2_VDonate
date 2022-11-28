import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import './button.styl';
import './icon_button.styl';

/**
 * Перчисление типов кнопок
 */
export enum ButtonType {
  PRIMARY,
  OUTLINE,
  FINGERS,
  ICON,
}

interface SimpleButtonOptions {
  viewType:
    | ButtonType.PRIMARY
    | ButtonType.OUTLINE
    | ButtonType.FINGERS
  innerText: string
  actionType: 'submit' | 'button'
  clickCallback?: () => void
}

interface IconButtonOptions {
  viewType: ButtonType.ICON
  innerIcon: string
  actionType: 'button'
  clickCallback: () => void
}

type ButtonOptions = SimpleButtonOptions | IconButtonOptions

interface ButtonUpdateContext {
  innerText?: string
  callback?: () => void
}

/**
 * Компонент кнопка
 */
export default
class Button extends ComponentBase<'button', ButtonUpdateContext> {
  constructor(el: HTMLElement, private options: ButtonOptions) {
    super();
    this.renderTo(el);
  }

  update(data: ButtonUpdateContext): void {
    if (data.innerText) {
      querySelectorWithThrow(this.domElement, '.button__text').textContent =
        data.innerText;
    }
    if (this.options.clickCallback && data.callback) {
      this.domElement.removeEventListener('click', this.options.clickCallback);
      this.options.clickCallback = data.callback;
      this.domElement.addEventListener('click', this.options.clickCallback);
    }
  }

  protected render(): HTMLButtonElement {
    const button = document.createElement('button');
    button.setAttribute('type', this.options.actionType);
    if (this.options.clickCallback) {
      button.addEventListener('click', this.options.clickCallback);
    }

    if (this.options.viewType === ButtonType.ICON) {
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
      case ButtonType.PRIMARY:
        button.classList.add('button__back_primary');
        break;
      case ButtonType.OUTLINE:
        button.classList.add('button__back_outline');
        break;
      case ButtonType.FINGERS:
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
