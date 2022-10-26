import routes from '@configs/router';

/**
 * Вызывает рендер страницы по переданому пути
 * @param {string} loc путь страницы
 */
const go = (loc: string) => {
  const route = routes.certain.find((obj) => loc.match(obj.path));
  window.history.pushState(null, '', loc);
  console.log(loc);
  route === undefined ? routes.uncertain() : route.render();
};

export default ((): (loc: string) => void => {
  window.addEventListener('click', (e) => {
    const target = (e.target as Element).closest('a[data-link]');
    if (target !== null) {
      e.preventDefault();
      go(target.getAttribute('href') ?? '/');
    }
  });

  window.addEventListener('popstate', () => {
    const route = routes.certain.find(
        (obj) => window.location.pathname.match(obj.path),
    );
      route === undefined ? routes.uncertain() : route.render();
  });

  return go;
})();
