import './button.styl';

/**
 * Перчисление типов кнопок
 */
export enum ButtonType {
  primary,
  outline,
  fingers,
}

/**
 * Компонент кнопка
 */
export class Button {
  /**
   * Актуальный контейнер кнопки
   */
  readonly element : HTMLButtonElement;

  /**
   * @param viewType дизайн кнопки
   * @param content текст в кнопке
   * @param actionType тип дейсмтвия
   */
  constructor(
      viewType: ButtonType,
      content: string,
      actionType: string,
  ) {
    this.element = document.createElement('button');
    this.element.setAttribute('type', actionType);
    this.element.classList.add(
        'button',
        'button__back');
    switch (viewType) {
      case ButtonType.primary:
        this.element.classList.add('button__back_primary');
        break;
      case ButtonType.outline:
        this.element.classList.add('button__back_outline');
        break;
      case ButtonType.fingers:
        this.element.classList.add('button__back_fingers');
        break;
      default:
        this.element.classList.add('button__back_primary');
        break;
    }
    const innerText = document.createElement('span');
    innerText.classList.add('button__text');
    innerText.textContent = content;
    this.element.appendChild(innerText);
  }
}
