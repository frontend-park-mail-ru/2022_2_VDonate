/**
 * Модуль рендера страницы 404
 * @module render404
 */

import errorTemplate from '@template/error.handlebars';

/**
 * Функция, которая рендерит страницу ошибки 404
 * @param {App} app Основной класс веб-приложения
 */
export default (app) => {
  app.main.innerHTML = errorTemplate({
    status: 404,
    description: 'Страница не найдена',
  });
};
