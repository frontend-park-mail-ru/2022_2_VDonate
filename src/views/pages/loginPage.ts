import {Button, ButtonType} from '@components/button/button';
import {Input, InputType} from '@components/input/input';
import login from '@actions/login';
import {LoginForm} from '@actions/types/login';
import store from '@app/store';
import {IView} from '@flux/types/view';
import {IObserver} from '@flux/types/observer';
/** Интерфейс структорного представления страницы из компонентов */
interface login {
  form: HTMLFormElement,
  children: {
    username: Input,
    password: Input,
    submitBtn: Button,
  }
}
/** Реализация интерфейса *IView* для страницы входа */
export default class LoginPage implements IView, IObserver {
  /** Структорное представление страницы из компонентов */
  private components: login;
  /** Конструктор */
  constructor() {
    this.components = {
      form: document.createElement('form'),
      children: {
        username: new Input(
            InputType.username,
            {
              label: 'Псевдоним',
              name: 'username',
              placeholder: 'Введите псевдоним',
            },
        ),
        password: new Input(
            InputType.password,
            {
              label: 'Пароль',
              name: 'password',
              placeholder: 'Введите пароль',
            },
        ),
        submitBtn: new Button(ButtonType.primary, 'Press Me!', 'submit'),
      },
    };
    this.components.form.append(
        this.components.children.username.element,
        this.components.children.password.element,
        this.components.children.submitBtn.element,
    );
    store.registerObserver(this);
  }
  /** Оповещение об изменением хранилища */
  notify(): void {
    this.rerender();
  }
  /** Сброс страницы, отключение от хранилища */
  reset(): void {
    store.removeObserver(this);
    this.components.form.remove();
  }
  /**
   * Создание страницы входа
   * @returns Страница-элемент
   */
  render(): HTMLElement {
    this.components.form.style.display = 'flex';
    this.components.form.style.flexDirection = 'column';
    this.components.form.style.gap = '10px';
    this.components.form.addEventListener('submit', (e) => {
      e.preventDefault();
      login(
        (e.target as HTMLFormElement).elements as LoginForm,
        store.dispatch.bind(store),
      );
    });
    return this.components.form;
  }
  /** Перерисовка страницы по текущему состоянию хранилища */
  rerender(): void {}// eslint-disable-line @typescript-eslint/no-empty-function
}

