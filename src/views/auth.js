/**
 * Модуль рендера страницы авторизации
 * @module auth
 */

/**
 * @const {Object} contextLogIn обьект с контекстом страницы авторизации
 */
const contextLogIn = {
  formTitle: 'Вход',
  formName: 'login',
  inputs: [
    {
      title: 'Логин',
      placeholder: 'example@example.ru',
      name: 'email',
      type: 'text',
    },
    {
      title: 'Пароль',
      placeholder: 'Любые символы, кроме пробелов',
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
  el.id = 'main';
  el.className = 'main';
  const frm = document.createElement('form');
  frm.className = 'form';
  frm.name = formName;
  frm.onsubmit =() => {
    processForm(frm, router); 
    return false;
  };
  frm.innerHTML += form(contextLogIn);
  el.appendChild(frm)
  router.root.appendChild(el);

  const footer = Handlebars.templates.footer;
  router.root.innerHTML += footer();
}