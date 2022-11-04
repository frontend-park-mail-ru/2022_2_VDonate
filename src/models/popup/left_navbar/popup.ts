import {Glass, GlassType} from '@components/glass/glass';
import {Button, ButtonType} from '@components/button/button';
import {Input, InputType} from '@components/input/input';
import './popup.styl';

const popupContext = [
  {
    inputType: InputType.email,
    context: {
      label: 'Почта',
      placeholder: 'Введите свою почту',
      name: 'хз',
    },
  },
  {
    inputType: InputType.username,
    context: {
      label: 'Псевдоним',
      placeholder: 'Введите свой псеводим',
      name: 'хз',
    },
  },
  {
    inputType: InputType.password,
    context: {
      label: 'Пароль',
      placeholder: 'Введите свой пароль',
      name: 'ххзз',
    },
  },
  {
    inputType: InputType.password,
    context: {
      label: 'Повторите пароль',
      placeholder: 'Введите свой пароль',
      name: 'ххзз',
    },
  },
];

/**
 * Модель изменяемого окна
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
      change: () => boolean,
  ) {
    const popupGlass = new Glass(GlassType.lines);
    popupGlass.element.classList.add('change-popup');
    const darkening = document.createElement('div');
    darkening.classList.add('change-popup__back');
    darkening.appendChild(popupGlass.element);
    this.element = darkening;
    this.element.style.display = 'none';
    const head = document.createElement('span');
    head.classList.add('change-popup__head');
    head.innerText = 'Изменение данных';
    popupGlass.element.appendChild(head);
    popupContext.forEach(({inputType, context}) => {
      const inputEl = new Input(inputType, context);
      inputEl.element.classList.add('change-popup__input');
      popupGlass.element.appendChild(inputEl.element);
    });
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('change-popup__btn-container');
    const cansel = new Button(ButtonType.outline, 'Отмена', 'button');
    cansel.element.onclick = () => {
      this.element.style.display = 'none';
    };
    const changeBtn = new Button(ButtonType.primary, 'Изменить', 'submit');
    changeBtn.element.onclick = () => {
      change();
      this.element.style.display = 'none';
    };
    btnContainer.appendChild(cansel.element);
    btnContainer.appendChild(changeBtn.element);
    popupGlass.element.appendChild(btnContainer);
  }
}
