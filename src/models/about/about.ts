import {Glass, GlassType} from '@components/glass/glass';
import {IconButton} from '@components/icon_button/icon_button';
import {Popup} from '../popup/post_and_about/popup';
import './about.styl';
import redactIcn from '@icon/redact.svg';
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
   * @param changeable возможность изменять текст
   */
  constructor(data: string, changeable: boolean) {
    const glass = new Glass(GlassType.mono);
    this.element = glass.element;
    this.element.classList.add('about');
    const head = document.createElement('div');
    head.classList.add('about__head');
    head.innerText = 'Обо мне';
    if (changeable) {
      const redactBtn = new IconButton(redactIcn, 'button');
      redactBtn.element.classList.add('about__head_btn');
      head.appendChild(redactBtn.element);
      // TODO: вызвать изменение вместо пустой фунции
      const popup = new Popup(
          'Обо мне',
          data,
          () => {
            // TODO: вызвать изменение вместо пустой фунции
            return true;
          });
      redactBtn.element.onclick = () => {
        popup.element.style.display = 'flex';
      };
      document.getElementById('entry')?.appendChild(popup.element);
    }
    const about = document.createElement('div');
    about.classList.add('about__text');
    about.innerHTML = data;
    this.element.appendChild(head);
    this.element.appendChild(about);
  }
}
