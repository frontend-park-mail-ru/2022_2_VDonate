/**
 * Модуль рендера страницы авторизации
 * @module signup
 */

/**
 * @const {Object} contextSignUp объект с контекстом страницы регистрации
 */
const contextSignUp = {
  formTitle: 'Регистрация',
  formName: 'signup',
  inputs: [
    {
      title: 'Логин',
      placeholder: 'example@example.ru',
      name: 'email',
      type: 'text',
    },
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
    {
      title: 'Повторите пароль',
      placeholder: 'До 30 символов',
      name: 'passwordRepeat',
      type: 'password',
    },
  ],
  buttonTittle: 'Зарегистрироваться',
  orButton: {
    title: 'Войти',
    link: '/login',
  }
};


/**
 * Функция, которая рендерит страницу регистрации
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default async (router) => {
  router.root.innerHTML = '';

  const signlog = Handlebars.templates.signlog;
  router.root.innerHTML += signlog(contextSignUp);

  const footer = Handlebars.templates.footer;
  router.root.innerHTML += footer();
}
