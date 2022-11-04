import {Button, ButtonType} from '@components/button/button';
import {Glass, GlassType} from '@components/glass/glass';
import {Image, ImageType} from '@components/image/image';
import {Popup} from '../popup/sub/popup';
import './sub.styl';
import subHbs from './sub.hbs';

interface Data {
  id: string,
  subName: string,
  lvl: string,
  img: string,
  price: string,
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

  /**
   * @param data данные для генерации
   */
  constructor(data: Data) {
    const lvlImg = new Image(ImageType.sub, '96px', data.img);
    const button = new Button(ButtonType.primary, 'Задонатить', 'button');
    const glass = new Glass(GlassType.mono);
    this.element = glass.element;
    this.element.classList.add('sub');
    this.element.innerHTML = subHbs({
      id: data.id,
      subName: data.subName,
      lvl: data.lvl,
      subImg: lvlImg.element.outerHTML,
      price: data.price,
      period: data.period,
      button: button.element.outerHTML,
      motivation: data.motivation,
    });
    const motivation =
        this.element.getElementsByClassName('sub__motivation').item(0);
    const showMore = document.createElement('a');
    showMore.classList.add('sub__more');
    showMore.textContent = 'показать еще';
    showMore.onclick = ()=> {
      motivation?.classList.remove('sub__motivation_part');
      showMore.hidden = true;
    };
    this.element.firstChild?.appendChild(showMore);
    const popupEdit = new Popup(() => {
      // TODO: функция отправки на сервер согласия на донат
      return true;
    });
    this.element.getElementsByTagName('button')[0].onclick = () => {
      popupEdit.element.style.display = 'flex';
    };
    document.getElementById('entry')?.appendChild(popupEdit.element);
  }
}
