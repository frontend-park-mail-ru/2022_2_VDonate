import {Glass, GlassType} from '@components/glass/glass';
import {Button, ButtonType} from '@components/button/button';
import './popup.styl';
import {IObserver} from '@flux/types/observer';
import store from '@app/store';
/**
 * Модель окна подтверждения подписки
 */
export class Popup implements IObserver {
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
    const text = document.createElement('span');
    text.classList.add('sub-popup__text');
    text.innerText = 'Вы действительно собиратесь задонатить';
    popupGlass.element.appendChild(text);
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('sub-popup__btn-container');
    const cansel = new Button(ButtonType.outline, 'Отмена', 'button');
    cansel.element.onclick = () => {
      this.element.remove();
    };
    const changeBtn = new Button(ButtonType.primary, 'Задонатить', 'submit');
    changeBtn.element.onclick = () => {
      change();
      // это временно (после логики в notify удалить)
      this.element.remove();
    };
    btnContainer.appendChild(cansel.element);
    btnContainer.appendChild(changeBtn.element);
    popupGlass.element.appendChild(btnContainer);
    store.registerObserver(this);
  }

  /** Callback метод обновления хранилища */
  notify(): void {
    // TODO логика
    this.element.remove();
  }
}
