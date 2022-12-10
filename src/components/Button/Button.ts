import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import './button.styl';

/**
 * Перчисление типов кнопок
 */
export enum ButtonType {
  PRIMARY,
  OUTLINE,
  IMAGE_BG,
  ICON,
  IMAGE_LOADING,
}

interface SubmitButtonOptions {
  actionType: 'button'
  clickHandler: (event: Event) => void
}

interface SimpleButtonOptions {
  actionType: 'submit'
}

interface TextButtonOptions {
  viewType:
    | ButtonType.PRIMARY
    | ButtonType.OUTLINE
    | ButtonType.IMAGE_BG
  innerText: string
}

interface IconButtonOptions {
  viewType:
    | ButtonType.ICON
    | ButtonType.IMAGE_LOADING
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
    switch (this.options.viewType) {
      case ButtonType.ICON:
      case ButtonType.IMAGE_LOADING:
        if (this.options.innerIcon === data.inner) return;
        this.options.innerIcon = data.inner;
        (querySelectorWithThrow(this.domElement, 'img') as HTMLImageElement)
            .src = this.options.innerIcon;
        break;
      case ButtonType.PRIMARY:
      case ButtonType.OUTLINE:
      case ButtonType.IMAGE_BG:
        if (this.options.innerText === data.inner) return;
        this.options.innerText = data.inner;
        querySelectorWithThrow(this.domElement, '.button__text').textContent =
          data.inner;
        break;
      default:
        break;
    }
  }

  protected render(): HTMLButtonElement {
    const button = document.createElement('button');
    button.setAttribute('type', this.options.actionType);

    button.classList.add(
        'button',
        'button__back');
    //  Add click handler
    if (this.options.actionType === 'button') {
      button.addEventListener('click', this.options.clickHandler);
    }


    switch (this.options.viewType) {
      case ButtonType.PRIMARY:
        button.classList.add('bg_button_primary');
        break;
      case ButtonType.OUTLINE:
        button.classList.add('bg_button_outline');
        break;
      case ButtonType.IMAGE_BG:
        button.classList.add('bg_button_image-bg');
        break;
      case ButtonType.ICON: {
        button.classList.add('bg_button_icon');
        const innerIcon = document.createElement('img');
        innerIcon.className = 'button__icon';
        innerIcon.src = this.options.innerIcon;
        button.appendChild(innerIcon);
        return button;
      }
      case ButtonType.IMAGE_LOADING: {
        button.classList.add('bg_button_icon');
        const innerIcon = document.createElement('img');
        innerIcon.className = 'button__icon';
        innerIcon.src = this.options.innerIcon;

        const input = document.createElement('input');
        input.classList.add('button__input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        button.append(innerIcon, input);
        if (this.options.actionType === 'button') {
          button.removeEventListener('click', this.options.clickHandler);
          button.addEventListener('click', ()=>{
            input.click();
          });
          input.addEventListener('change', this.options.clickHandler);
        }
        return button;
      }
      default: {
        const _: never = this.options;
        return _;
      }
    }

    const innerText = document.createElement('span');
    innerText.classList.add('button__text', 'font_regular');
    innerText.textContent = this.options.innerText;
    button.appendChild(innerText);

    return button;
  }
}
