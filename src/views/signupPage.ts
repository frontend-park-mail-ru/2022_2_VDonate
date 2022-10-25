import {Button, ButtonType} from '@components/button/button';
import {Input, InputType} from '@components/input/input';

/**
 * Функция, которая рендерит страницу авторизации
 * @param {App} app Основной класс веб-приложения
 */
export default () => {
  const contaner = document.createElement('form');
  contaner.style.display = 'flex';
  contaner.style.flexDirection = 'column';
  contaner.style.gap = '10px';
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
  contaner.append(username.element, password.element, button.element);
  document.getElementById('main')?.appendChild(contaner);
};
