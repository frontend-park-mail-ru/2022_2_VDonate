import routes from '@configs/router';

/** sds */
export default class Router {
  /** */
  constructor() {
    window.addEventListener('click', (e) => {
      const target = (e.target as Element).closest('a[data-link]');
      if (target !== null) {
        e.preventDefault();
        this.go(target.getAttribute('href') ?? '/');
      }
    });

    window.addEventListener('popstate', () => {
      const route = routes.certain.find(
          (obj) => window.location.pathname.match(obj.path),
      );
      route === undefined ? routes.uncertain() : route.render();
    });

    this.go(location.pathname + location.search);
  }

  /**
     * Функция, которая вызывает рендер страницы по переданому пути
     * @param {string} loc путь страницы
     */
  go(loc: string) {
    const route = routes.certain.find((obj) => loc.match(obj.path));
    window.history.pushState(null, '', loc);
    route === undefined ? routes.uncertain() : route.render();
  }
}
