/**
 * Модуль рендера страницы 404
 * @module render404
 */

import errorTemplate from '@template/error.handlebars';

/**
 * Функция, которая рендерит страницу ошибки 404
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default (router) => {
  router.main.innerHTML = '';
  router.main.innerHTML += errorTemplate({
    status: 404,
    description: 'Страница не найдена',
  });
};
