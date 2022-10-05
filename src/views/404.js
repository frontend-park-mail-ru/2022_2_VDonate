/**
 * Модуль рендера страницы 404
 * @module render404
 */

/**
 * Функция, которая рендерит страницу ошибки 404
 */
export default (router) => {
    router.root.innerHTML = '';
    const errorEl = Handlebars.templates.error;
    router.root.innerHTML += errorEl({
        status: 404,
        description: 'Страница не найдена',
        id: router.id,
    })
}