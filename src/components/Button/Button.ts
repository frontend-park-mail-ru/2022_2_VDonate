import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import './button.styl';

/**
 * Перчисление типов кнопок
 */
export enum ButtonType {
  PRIMARY,
  OUTLINE,
  FINGERS,
  ICON,
}

interface SubmitButtonOptions {
  actionType: 'button'
  clickHandler: () => void
}

interface SimpleButtonOptions {
  actionType: 'submit'
}

interface TextButtonOptions {
  viewType:
    | ButtonType.PRIMARY
    | ButtonType.OUTLINE
    | ButtonType.FINGERS
  innerText: string
}

interface IconButtonOptions {
  viewType: ButtonType.ICON
  innerIcon: string
}

type ButtonOptions =
  (TextButtonOptions | IconButtonOptions) &
  (SubmitButtonOptions | SimpleButtonOptions);

interface ButtonUpdateContext {
  inner: string
}

/**
 * Компонент кнопка
 */
export default
class Button extends ComponentBase<'button', ButtonUpdateContext> {
  constructor(el: HTMLElement, private options: ButtonOptions) {
    super();
    this.renderTo(el);
    options.viewType;
  }

  update(data: ButtonUpdateContext): void {
    if (this.options.viewType === ButtonType.ICON) {
      this.updateIcon(data.inner);
    } else {
      this.updateText(data.inner);
    }
  }

  private updateIcon(innerIcon: string): void {
    if (this.options.viewType !== ButtonType.ICON) return;
    if (this.options.innerIcon === innerIcon) return;
    this.options.innerIcon = innerIcon;
    const icon =
      querySelectorWithThrow(this.domElement, 'img') as HTMLImageElement;
    icon.src = this.options.innerIcon;
  }

  private updateText(innerText: string): void {
    if (this.options.viewType === ButtonType.ICON) return;
    if (this.options.innerText === innerText) return;
    this.options.innerText = innerText;
    querySelectorWithThrow(this.domElement, '.button__text').textContent =
      innerText;
  }

  protected render(): HTMLButtonElement {
    const button = document.createElement('button');
    button.setAttribute('type', this.options.actionType);
    if (this.options.actionType === 'button') {
      button.addEventListener('click', this.options.clickHandler);
    }

    if (this.options.viewType === ButtonType.ICON) {
      button.classList.add(
          'icon-button',
          'icon-button__back',
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
        button.classList.add('button__back_style_primary');
        break;
      case ButtonType.OUTLINE:
        button.classList.add('button__back_style_outline');
        break;
      case ButtonType.FINGERS:
        button.classList.add('button__back_style_fingers');
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
