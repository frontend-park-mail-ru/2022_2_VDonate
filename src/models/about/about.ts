import {Glass, GlassType} from '@components/glass/glass';
import './about.styl';

/**
 * Модель поля 'Обо мне'
 */
export class About {
  /**
   * Актуальный контейнер
   */
  readonly element : HTMLElement;

  /**
   * @param data текст об авторе
   */
  constructor(data: string) {
    const glass = new Glass(GlassType.mono);
    this.element = glass.element;
    this.element.classList.add('about');
    const head = document.createElement('div');
    head.classList.add('about__head');
    head.innerText = 'Обо мне';
    const about = document.createElement('div');
    about.classList.add('about__text');
    about.innerHTML = data;
    this.element.appendChild(head);
    this.element.appendChild(about);
  }
}
