import {Button, ButtonType} from '@components/button/button';
import {Input, InputType} from '@components/input/input';
import login from '@actions/login';
import {LoginForm} from '@actions/types/login';
import store from '@app/store';
import {State} from '@flux/types/store';

/** Корневой вид страницы входа */
class LoginPage {
  private state: State;
  /** Получает текущее состояние и пописывается на изменение хранилища */
  constructor() {
    this.state = store.getState();
    const main = document.getElementById('main');
    if (main) {
      main.innerHTML = '';
    }
    this.render();
    store.registerObserver(this.observer.bind(this));
  }

  /** Наблюдатель за именением хранилища */
  observer() {
    this.state = store.getState();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(this.state.user.id);
  }

  /** Рендринг страницы */
  render() {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '10px';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      login(form.elements as LoginForm, store.dispatch.bind(store));
    });
    const username = new Input(InputType.username, {
      label: 'Псевдоним',
      name: 'username',
      placeholder: 'Введите псевдоним',
    });
    const password = new Input(InputType.password, {
      label: 'Пароль',
      name: 'password',
      placeholder: 'Введите пароль',
    });
    const button = new Button(ButtonType.primary, 'Press Me!', 'submit');
    form.append(username.element, password.element, button.element);
    document.getElementById('main')?.appendChild(form);
  }
}

export default () => {
  new LoginPage();
};
