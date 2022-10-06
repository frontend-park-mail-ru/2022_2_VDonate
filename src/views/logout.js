/**
 * Модуль логики выхода из учетной записи
 * @module logout
 */

import login from './login.js';

/**
 * Функция логики выхода из учетной записи
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default (router) => {
  router.api.logout()
    .then(login(router));
};
