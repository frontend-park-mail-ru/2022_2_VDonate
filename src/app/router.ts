import routing from '@actions/handlers/routing';
import {Pages, routes} from '@configs/router';

/** Роутинг урлов */
class Router {
  /** Добавляется события роутрера */
  constructor() {
    window.addEventListener('click', (e) => {
      const target = (e.target as Element).closest('a[data-link]');
      if (target !== null) {
        e.preventDefault();
        this.go(target.getAttribute('href') ?? '/');
      }
    });

    window.addEventListener('popstate', () => {
      routing(window.location.pathname);
    });
  }

  /**
   * Вызывает рендер страницы по переданому пути
   * @param {string} loc путь страницы
   * @returns TODO
   */
  go(loc: string): Pages {
    window.history.pushState(null, '', loc);
    return routes.find((obj) => loc.match(obj.path))?.type ?? Pages.NOT_FOUND;
  }
}

export default new Router();
