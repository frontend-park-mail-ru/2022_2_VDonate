import {Glass, GlassType} from '@components/glass/glass';
import {Button, ButtonType} from '@components/button/button';
import {Input, InputType} from '@components/input/input';
import './popup.styl';
import changeUserData from '@actions/handlers/changeUserData';
import {
  ChangeUserDataForm,
  PayloadChangeUserData,
  PayloadChangeUserDataErrors} from '@actions/types/changeUserData';
import {IObserver} from '@flux/types/observer';
import store from '@app/store';
import {PayloadUser} from '@actions/types/user';

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

  private becomeAuthor: HTMLElement | undefined;
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
    const user = store.getState().user as PayloadUser | null;
    if (!user?.isAuthor) {
      this.becomeAuthor = document.createElement('div');
      this.becomeAuthor.classList.add('change-popup__author');
      const inputAuthor = document.createElement('input');
      inputAuthor.classList.add('change-popup__author_checkbox');
      inputAuthor.type = 'checkbox';
      inputAuthor.name = 'isAuthor';
      const text = document.createElement('span');
      text.classList.add('change-popup__author_text');
      text.innerText = 'Стать автором';
      this.becomeAuthor.append(inputAuthor, text);
      form.appendChild(this.becomeAuthor);
    }
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('change-popup__btn-container');
    const cansel = new Button(ButtonType.outline, 'Отмена', 'button');
    cansel.element.onclick = () => {
      this.element.remove();
    };
    const changeBtn = new Button(ButtonType.primary, 'Изменить', 'submit');
    btnContainer.appendChild(cansel.element);
    btnContainer.appendChild(changeBtn.element);
    form.appendChild(btnContainer);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = (e.target as HTMLFormElement).elements as ChangeUserDataForm;
      const user = store.getState().user as PayloadUser;
      // TODO может как-то норм добавлять поля
      const userData: PayloadChangeUserData = {
        id: user.id,
      };
      if (form.username.value != '') {
        userData.username = form.username.value;
      }
      if (form.email.value != '') {
        userData.email = form.email.value;
      }
      if (form.password.value != '') {
        userData.password = form.password.value;
      }
      if (form.repeatPassword.value != '') {
        userData.repeatPassword = form.repeatPassword.value;
      }
      if (form.isAuthor?.checked) {
        userData.isAuthor = true;
      }
      changeUserData(userData);
    });
    store.registerObserver(this);
  }
  /** Callback метод обновления хранилища */
  notify(): void {
    const change =
      store.getState().formErrors as PayloadChangeUserDataErrors | null;
    if (
      !change?.email ||
      !change.password ||
      !change.repeatPassword ||
      !change.username ||
      !change.isAuthor) {
      this.element.remove();
    } else {
      // TODO отображение ошибок
    }
    const user = store.getState().user as PayloadUser | null;
    if (user?.isAuthor) {
      this.becomeAuthor?.remove();
    }
  }
}
