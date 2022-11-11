import {Glass, GlassType} from '@components/glass/glass';
import './about.styl';

/**
 * Модель поля 'Обо мне'
 */
export class About {
  /**
   * Актуальный контейнер
   */
  readonly element: HTMLElement;

  private about: HTMLElement;
  private textAbout: string | undefined;
  /**
   * Конструктор
   */
  constructor() {
    const glass = new Glass(GlassType.mono);
    this.element = glass.element;
    this.element.classList.add('about');
    const head = document.createElement('div');
    head.classList.add('about__head');
    head.innerText = 'Обо мне';
    this.about = document.createElement('div');
    this.about.classList.add('about__text');
    this.element.appendChild(head);
    this.element.appendChild(this.about);
  }

  /**
   * @param about текст об авторе
   */
  setText(about: string | undefined) {
    if (!about || about.length == 0) {
      this.about.innerHTML = 'Пользователь пока что не расказал о себе';
    } else {
      this.about.innerHTML = about;
    }
  }
}
