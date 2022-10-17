import config from '@configs/appConfig';
import Api from '@modules/api.js';
import Router from '@modules/router';
import footer from '@template/footer.handlebars';

/**
 * Основной класс веб-приложения
 * @property {Router} router Класс маршрутизации по страницам сайта
 */
export default class App {
  /** */
  constructor() {
    config.HTMLblocks.forEach((obj) => {
      this[obj.field] = document.getElementById(obj.id);
    });

    this.api = new Api(config.baseUrl);
    this.router = new Router(this);

    this.footer.innerHTML = footer();
  }
  /**
   * Функция аутификации пользователя
   */
  authUser() {
    this.api.authUser()
        .then(({status, body}) => {
          if (status === 200) {
            this.id = body.id;
            this.router.goTo(location.pathname + location.search);
          } else {
            this.id = null;
            this.router.goTo('/login');
          }
        });
  }
}
