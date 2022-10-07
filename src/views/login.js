/**
 * Модуль рендера страницы авторизации
 * @module login
 */

/**
 * @const {Object} contextLogIn обьект с контекстом страницы авторизации
 */
const contextLogIn = {
  formTitle: 'Вход',
  formName: 'login',
  inputs: [
    {
      title: 'Псевдоним',
      placeholder: 'До 20 символов',
      name: 'username',
      type: 'text',
    },
    {
      title: 'Пароль',
      placeholder: 'До 30 символов',
      name: 'password',
      type: 'password',
    },
  ],
  buttonTittle: 'Войти',
  orButton: {
    title: 'Зарегистрироваться',
    link: '/signup',
  },
};

/**
 * Функция, которая рендерит страницу авторизации
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default async (router) => {
  router.root.innerHTML = '';

  const {signlog} = Handlebars.templates;
  router.root.innerHTML += signlog(contextLogIn);

  const {footer} = Handlebars.templates;
  router.root.innerHTML += footer();
};
