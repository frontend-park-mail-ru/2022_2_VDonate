/**
 * Модуль логики выхода из учетной записи
 * @module logout
 */

/**
 * Функция логики выхода из учетной записи
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default (router) => {
  router.id = undefined;
  router.api.logout()
      .then(router.goTo('/login'));
};
