import './icon_button.styl';

/**
 * Компонент кнопка с иконкой
 */
export class IconButton {
  /**
   * Актуальный контейнер кнопки с иконкой
   */
  readonly element : HTMLButtonElement;

  /**
   * @param icon url иконки
   * @param actionType тип действия
   */
  constructor(
      icon: string,
      actionType: string,
  ) {
    this.element = document.createElement('button');
    this.element.setAttribute('type', actionType);
    this.element.classList.add(
        'icon-button',
        'icon-button__back',
        'icon-button__back_fing',
    );
    const innerIcon = document.createElement('img');
    innerIcon.className = 'icon-button__icon';
    innerIcon.src = icon;
    this.element.appendChild(innerIcon);
  }
}
