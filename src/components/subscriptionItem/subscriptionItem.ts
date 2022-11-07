import {Image, ImageType} from '@components/image/image';
import './subscriptionItem.styl';

/**
 * Компонент элемента навбара
 */
export class SubscriptionItem {
  /**
   * Актуальный контейнер элемента навбара
   */
  readonly element: HTMLElement;
  /**
   * @param id id автора
   * @param img изображение
   * @param username имя
   * @param tier уровень подписки
   */
  constructor(
      id: number,
      img: string,
      username: string,
      tier: number,
  ) {
    this.element = document.createElement('a');
    this.element.setAttribute('href', `/profile?id=${id}`);
    this.element.setAttribute('data-link', '');
    this.element.classList.add('subscriptions-item');
    const avatar = new Image(ImageType.author, img);
    avatar.element.classList.add('subscriptions-item__img');
    const user = document.createElement('div');
    user.classList.add('subscriptions-item__username');
    user.innerText = username;
    const lvl = document.createElement('div');
    lvl.classList.add('subscriptions-item__tier');
    lvl.innerText = `Уровень ${tier}`;
    this.element.appendChild(avatar.element);
    this.element.appendChild(user);
    this.element.appendChild(lvl);
  }
}
