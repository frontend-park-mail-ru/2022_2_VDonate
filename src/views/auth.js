/**
 * Модуль рендера страницы авторизации
 * @module auth
 */

/**
 * @const {Object} contextAuth обьект с контекстом страницы авторизации
 */
const contextAuth = {
  formTitle: 'Вход',
  inputs: [
    {
      title: 'Почта',
      name: 'email',
      type: 'email',
    },
    {
      title: 'Пароль',
      name: 'password',
      type: 'password',
    },
  ],
  buttonTittle: 'Войти',
  orButton: {
    title: 'Зарегистрироваться',
    link: '/auth/sign',
  }
};

/**
 * Функция, которая рендерит страницу авторизации
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default async (router) => {
  router.root.innerHTML = '';

  const signlog = Handlebars.templates.signlog;
  router.root.innerHTML += signlog(contextAuth);

  const footer = Handlebars.templates.footer;
  router.root.innerHTML += footer();
}