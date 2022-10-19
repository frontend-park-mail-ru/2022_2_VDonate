'use_strict';

// import App from '@modules/app';
// import './style.styl';
import {Button, ButtonType} from '@components/button/button.ts';

/**
 * Основной класс веб-приложения
 * @const {App} app
 */
// const app = new App();
// app.authUser();

const but = new Button(ButtonType.primary, 'Нажми меня!', 'submit');
document.getElementById('main')?.appendChild(but.element);
