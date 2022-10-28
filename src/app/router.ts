import routing from '@actions/routing';

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
   */
  go(loc: string) {
    window.history.pushState(null, '', loc);
    routing(loc);
  }
}

export default new Router();
