'use_strict';

import App from '@modules/app';
import './style.styl';

/**
 * Основной класс веб-приложения
 * @const {App} app
 */
const app = new App();
app.authUser();
