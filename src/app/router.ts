import routing from '@actions/handlers/routing';
import {RouteType} from '@actions/types/routing';
import {Pages, routes} from '@configs/router';

/** Роутинг урлов */
class Router {
  /** Добавляется события роутрера */
  constructor() {
    window.addEventListener('click', (e) => {
      const target = (e.target as Element).closest('a[data-link]');
      if (target !== null) {
        e.preventDefault();
        routing(target.getAttribute('href') ?? '/', RouteType.STANDART);
      }
    });

    window.addEventListener('popstate', () => {
      routing(window.location.pathname +
        window.location.search, RouteType.POPSTATE);
    });
  }

  /**
   * Вызывает рендер страницы по переданому пути
   * @param {string} loc путь страницы
   * @returns TODO
   */
  go(loc: string): Pages {
    return routes.find((obj) => loc.match(obj.path))?.type ?? Pages.NOT_FOUND;
  }
}

export default new Router();
