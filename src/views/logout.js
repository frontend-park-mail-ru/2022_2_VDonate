/**
 * Модуль логики выхода из учетной записи
 * @module logout
 */

/**
 * Функция логики выхода из учетной записи
 * @param {App} app Основной класс веб-приложения
 */
export default (app) => {
  app.id = undefined;
  app.api.logout()
      .then(app.router.goTo('/login'));
};
