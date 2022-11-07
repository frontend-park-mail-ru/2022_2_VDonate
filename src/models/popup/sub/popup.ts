import {Glass, GlassType} from '@components/glass/glass';
import {Button, ButtonType} from '@components/button/button';
import './popup.styl';

/**
 * Модель окна подтверждения подписки
 */
export class Popup {
  /**
   * Актуальный контейнер
   */
  readonly element: HTMLElement;

  /**
   * @param change Функция валидации и отправки на сервер
  */
  constructor(
      change: () => void,
  ) {
    const popupGlass = new Glass(GlassType.lines);
    popupGlass.element.classList.add('sub-popup__glass');
    const darkening = document.createElement('div');
    darkening.classList.add('sub-popup__back');
    darkening.appendChild(popupGlass.element);
    this.element = darkening;
    this.element.style.display = 'none';
    const text = document.createElement('span');
    text.classList.add('sub-popup__text');
    text.innerText = 'Вы действительно собиратесь задонатить';
    popupGlass.element.appendChild(text);
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('sub-popup__btn-container');
    const cansel = new Button(ButtonType.outline, 'Отмена', 'button');
    cansel.element.onclick = () => {
      this.element.style.display = 'none';
    };
    const changeBtn = new Button(ButtonType.primary, 'Задонатить', 'submit');
    changeBtn.element.onclick = () => {
      change();
      this.element.style.display = 'none';
    };
    btnContainer.appendChild(cansel.element);
    btnContainer.appendChild(changeBtn.element);
    popupGlass.element.appendChild(btnContainer);
  }
}
