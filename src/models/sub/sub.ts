import {Button, ButtonType} from '@components/button/button';
import {Glass, GlassType} from '@components/glass/glass';
import {Image, ImageType} from '@components/image/image';
import {Popup, SubType} from '../popup/sub/popup';
import './sub.styl';
import subHbs from './sub.hbs';
import {openSubscribtionEditor} from '@actions/handlers/editor';

interface Data {
  subType: SubType,
  AuthorID: number,
  id: number,
  subName: string,
  lvl: number,
  img: string,
  price: number,
  period: string,
  motivation: string,
}

/**
 * Модель уровня подписки
 */
export class Sub {
  /**
   * Актуальный контейнер уровня подписки
   */
  readonly element: HTMLElement;

  private button: Button;
  /**
   * @param data данные для генерации
   */
  constructor(data: Data) {
    const lvlImg = new Image(ImageType.sub, data.img);
    lvlImg.element.classList.add('sub__img');
    switch (data.subType) {
      case SubType.SUBSCRIBE:
        this.button = new Button(ButtonType.primary, 'Задонатить', 'button');
        this.button.element.addEventListener('click', () => {
          const popup = new Popup(data.AuthorID, data.id, data.subType);
          document.body.appendChild(popup.element);
        });
        break;
      case SubType.UNSUBSCRIBE:
        this.button = new Button(ButtonType.primary, 'Отписаться', 'button');
        this.button.element.addEventListener('click', () => {
          const popup = new Popup(data.AuthorID, data.id, data.subType);
          document.body.appendChild(popup.element);
        });
        break;
      case SubType.EDITSUBSCRIBE:
        this.button = new Button(ButtonType.primary, 'Задонатить', 'button');
        this.button.element.addEventListener('click', () => {
          openSubscribtionEditor(data.id);
        });
        break;
      default:
        break;
    }
    this.button = new Button(ButtonType.primary, 'Задонатить', 'button');
    const glass = new Glass(GlassType.mono);
    this.element = glass.element;
    this.element.innerHTML = subHbs({
      id: data.id,
      subName: data.subName,
      lvl: data.lvl,
      subImg: lvlImg.element.outerHTML,
      price: data.price,
      period: data.period,
      button: this.button.element.outerHTML,
      motivation: data.motivation,
    });
    const motivation =
        this.element.getElementsByClassName('sub__motivation').item(0);
    const showMore = document.createElement('a');
    showMore.classList.add('sub__more');
    showMore.textContent = 'показать еще';
    showMore.addEventListener('click', () => {
      motivation?.classList.remove('sub__motivation_part');
      showMore.hidden = true;
    });
    this.element.firstChild?.appendChild(showMore);
  }
}
