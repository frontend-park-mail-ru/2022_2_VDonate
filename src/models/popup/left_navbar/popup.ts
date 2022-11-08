import {Glass, GlassType} from '@components/glass/glass';
import {Button, ButtonType} from '@components/button/button';
import {Input, InputType} from '@components/input/input';
import './popup.styl';
import changeUserData from '@actions/handlers/changeUserData';
import {
  ChangeUserDataForm,
  PayloadChangeUserDataErrors} from '@actions/types/changeUserData';
import {IObserver} from '@flux/types/observer';
import store from '@app/store';

const popupContext = [
  {
    inputType: InputType.email,
    context: {
      label: 'Почта',
      placeholder: 'Введите свою почту',
      name: 'email',
    },
  },
  {
    inputType: InputType.username,
    context: {
      label: 'Псевдоним',
      placeholder: 'Введите свой псеводим',
      name: 'username',
    },
  },
  {
    inputType: InputType.password,
    context: {
      label: 'Пароль',
      placeholder: 'Введите свой пароль',
      name: 'password',
    },
  },
  {
    inputType: InputType.password,
    context: {
      label: 'Повторите пароль',
      placeholder: 'Введите свой пароль',
      name: 'repeatPassword',
    },
  },
];

/**
 * Модель изменяемого окна
 */
export class Popup implements IObserver {
  /**
   * Актуальный контейнер
   */
  readonly element: HTMLElement;

  /**
   * конструктор
  */
  constructor() {
    const popupGlass = new Glass(GlassType.lines);
    popupGlass.element.classList.add('change-popup__glass');
    const darkening = document.createElement('div');
    darkening.classList.add('change-popup__back');
    darkening.appendChild(popupGlass.element);
    this.element = darkening;
    this.element.style.display = 'none';
    const form = document.createElement('form');
    form.classList.add('change-popup__form');
    popupGlass.element.appendChild(form);
    const head = document.createElement('span');
    head.classList.add('change-popup__head');
    head.innerText = 'Изменение данных';
    form.appendChild(head);
    popupContext.forEach(({inputType, context}) => {
      const inputEl = new Input(inputType, context);
      inputEl.element.classList.add('change-popup__input');
      form.appendChild(inputEl.element);
    });
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('change-popup__btn-container');
    const cansel = new Button(ButtonType.outline, 'Отмена', 'button');
    cansel.element.onclick = () => {
      this.element.style.display = 'none';
    };
    const changeBtn = new Button(ButtonType.primary, 'Изменить', 'submit');
    btnContainer.appendChild(cansel.element);
    btnContainer.appendChild(changeBtn.element);
    form.appendChild(btnContainer);
    form.addEventListener('submit', (e) => {
      console.log('subm');
      e.preventDefault();
      changeUserData(
        (e.target as HTMLFormElement).elements as ChangeUserDataForm);
    });
    store.registerObserver(this);
  }
  /** Callback метод обновления хранилища */
  notify(): void {
    const change =
      store.getState().formErrors as PayloadChangeUserDataErrors;
    if (
      !change.email ||
      !change.password ||
      !change.repeatPassword ||
      !change.username) {
      this.element.style.display = 'none';
    }
    // TODO отображение ошибок
  }
}
