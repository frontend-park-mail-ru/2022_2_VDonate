'use_strict';

// import App from '@modules/app';
// import './style.styl';
import {Button, ButtonType} from '@components/button/button.ts';
import {Input, InputType} from '@components/input/input.ts';

/**
 * Основной класс веб-приложения
 * @const {App} app
 */
// const app = new App();
// app.authUser();
const main = document.getElementById('main');
const but = new Button(ButtonType.primary, 'Нажми меня!', 'submit');
main.appendChild(but.element);

const input = new Input(
    InputType.username,
    {
      label: 'Псевдоним',
      placeholder: 'Введите свой псевдоним',
      name: 'username',
    },
);
main.appendChild(input.element);
input.errorDetect(true);
input.errorDetect(true);
input.errorDetect(true);

setTimeout(() => {
  input.errorDetect(false);
}, 2000);
