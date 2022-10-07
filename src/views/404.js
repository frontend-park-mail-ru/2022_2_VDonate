/**
 * Модуль рендера страницы 404
 * @module render404
 */

/**
 * Функция, которая рендерит страницу ошибки 404
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default (router) => {
  router.header.innerHTML = '';
  router.main.innerHTML = '';
  const errorEl = Handlebars.templates.error;
  router.main.innerHTML += errorEl({
    status: 404,
    description: 'Страница не найдена',
  });
  const link = document.getElementById('post-block-link');
  link.onclick = () => {
    history.go(-1);
  };
};
