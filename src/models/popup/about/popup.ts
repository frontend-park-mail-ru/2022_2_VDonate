import {Glass, GlassType} from '@components/glass/glass';
import {Button, ButtonType} from '@components/button/button';
import './popup.styl';
import changeUserData from '@actions/handlers/changeUserData';
import {PayloadUser} from '@actions/types/user';
import store from '@app/store';

/**
 * Модель изменяемого окна
 */
export class Popup {
  /**
   * Актуальный контейнер
   */
  readonly element: HTMLElement;

  /**
   * @param title заголовок
   * @param content изменяемый текст
   * @param change функция изменения
   */
  constructor(
      title: string,
      content: string,
  ) {
    const popupGlass = new Glass(GlassType.lines);
    popupGlass.element.classList.add('popup__glass');
    const darkening = document.createElement('div');
    darkening.classList.add('popup__back');
    this.element = darkening;
    this.element.style.display = 'none';
    const popupHead = document.createElement('span');
    popupHead.classList.add('popup__head');
    popupHead.innerText = title;
    const popupAboutBack = document.createElement('div');
    popupAboutBack.classList.add('popup__text_back');
    const popupAbout = document.createElement('textarea');
    popupAbout.classList.add('popup__text_field');
    popupAbout.innerText = content;
    popupAboutBack.appendChild(popupAbout);
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('popup__btn-container');
    const cansel = new Button(ButtonType.outline, 'Отмена', 'button');
    cansel.element.onclick = () => {
      this.element.style.display = 'none';
    };
    const changeBtn = new Button(ButtonType.primary, 'Изменить', 'submit');
    changeBtn.element.onclick = () => {
      const user = store.getState().user as PayloadUser;
      changeUserData({
        id: user.id,
        about: popupAbout.innerText,
      });
      this.element.style.display = 'none';
    };
    btnContainer.appendChild(cansel.element);
    btnContainer.appendChild(changeBtn.element);
    popupGlass.element.appendChild(popupHead);
    popupGlass.element.appendChild(popupAboutBack);
    popupGlass.element.appendChild(btnContainer);
    this.element.appendChild(popupGlass.element);
  }
}
