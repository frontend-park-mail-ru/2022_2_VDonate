/**
 * Модуль рендера страницы авторизации
 * @module auth
 */

/**
 * @const {Object} contextAuth обьект с контекстом страницы авторизации
 */
const contextLogIn = {
  formTitle: 'Вход',
  formName: 'login',
  inputs: [
    {
      title: 'Почта',
      name: 'email',
      type: 'text',
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
    link: '/signup',
  }
};

/**
 * Функция, которая рендерит страницу авторизации
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default async (router) => {
  router.root.innerHTML = '';

  const form = Handlebars.templates.form;
  const el = document.createElement('div');
  el.className = 'main';
  el.innerHTML += form(contextAuth);
  router.root.appendChild(el);
  router.root.innerHTML += footer();
}