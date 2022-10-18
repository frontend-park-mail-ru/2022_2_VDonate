/**
 * Модуль маршрутизации по страницам сайта
 * @module Router
 */

import render404 from '@views/404.js';
import routes from '@configs/routes.js';

/**
 * Класс маршрутизации по страницам сайта
 * @property {App} App Основной класс веб-приложения
 */
export default class Router {
  static _instance = null;

  /**
   * Конструктор, добавляющий обработку 2 событий:
   * переход между страницами и переход вперед/назад
   * @constructor
   * @param {App} app Основной класс веб-приложения
   * @return {Router}
   */
  constructor(app) {
    if (Router._instance != null) {
      return Router._instance;
    }
    this.app = app;
    Router._instance = this;
    window.addEventListener('click', (e) => {
      const target = e.target.closest('a[data-link]');
      if (target !== null) {
        e.preventDefault();
        this.goTo(target.getAttribute('href'));
      }
    });

    window.addEventListener('popstate', () => {
      const route = routes.find(
          (obj) => window.location.pathname.match(obj.path),
      );
      if (route !== undefined) {
        route.render(this.app);
      }
    });
    return this;
  }

  /**
     * Функция, которая вызывает рендер страницы по переданому пути
     * @param {string} loc путь страницы
     */
  goTo(loc) {
    const route = routes.find((obj) => loc.match(obj.path));
    window.history.pushState(null, null, loc);
    if (route === undefined) {
      render404(this.app);
    }
    route.render(this.app);
  }
}
