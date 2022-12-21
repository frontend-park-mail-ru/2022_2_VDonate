import routing from '@actions/handlers/routing';
import {RouteType} from '@actions/types/routing';
import {Pages, routes} from '@configs/router';

/** Роутинг урлов */
class Router {
  /** Добавляется события роутера */
  constructor() {
    window.addEventListener('click', (e) => {
      const target = (e.target as Element).closest('a[data-link]');
      if (target !== null) {
        e.preventDefault();
        routing(target.getAttribute('href') ?? '/');
      }
    });

    window.addEventListener('popstate', () => {
      routing(window.location.pathname +
        window.location.search, RouteType.POPSTATE);
    });
  }

  /**
   * Вызывает рендер страницы по переданному пути
   * @param {string} loc путь страницы
   * @param {RouteType} type тип перехода
   * @returns TODO
   */
  go(loc: string, type?: RouteType): Pages {
    switch (type) {
      case RouteType.POPSTATE:
        break;
      case RouteType.STANDART:
      default:
        window.history.pushState(null, '', loc);
        break;
    }
    return routes.find((obj) => loc.match(obj.path))?.type ?? Pages.NOT_FOUND;
  }
}

export default new Router();
