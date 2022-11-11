import './reaction.styl';
import commentIcon from '@icon/comment.svg';
import likeIcon from '@icon/like.svg';

/**
 * Перечисление типов кнопок
 */
export enum ReactType {
  likes,
  comments,
}


/**
 * Компонент кнопка
 */
export class ReactButton {
  /**
   * Актуальный контейнер кнопки
   */
  readonly element: HTMLButtonElement;

  /**
   * @param reactType дизайн кнопки
   * @param content текст в кнопке
   * @param actionType тип дейсмтвия
   * @param isActive состояние кнопки
   */
  constructor(
      reactType: ReactType,
      content: string,
      actionType: string,
      isActive: boolean,
  ) {
    this.element = document.createElement('button');
    this.element.setAttribute('type', actionType);
    this.element.classList.add(
        'reaction',
        'reaction__back',
        'reaction__back_outline');
    const innerIcon = document.createElement('img');
    innerIcon.className = 'reaction__icon';
    switch (reactType) {
      case ReactType.comments:
        innerIcon.src = commentIcon;
        this.element.appendChild(innerIcon);
        break;
      case ReactType.likes:
        innerIcon.src = likeIcon;
        if (isActive) {
          this.element.classList.add('reaction__like');
        }
        this.element.appendChild(innerIcon);
        break;
      default:
        break;
    }
    const innerText = document.createElement('span');
    innerText.classList.add('reaction__text');
    innerText.textContent = content;
    this.element.appendChild(innerText);
  }
}
