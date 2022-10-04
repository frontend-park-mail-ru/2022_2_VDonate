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
  const params = new URL(location.href).searchParams;
  const id = params.get('id');
  const header = Handlebars.templates.header;
  router.root.innerHTML = '';

  const form = Handlebars.templates.form;
  const el = document.createElement('div');
  el.id = 'main';
  el.className = 'main';
  el.innerHTML += form(contextAuth);
  router.root.appendChild(el);

  const footer = Handlebars.templates.footer;
  router.root.innerHTML += footer();
}