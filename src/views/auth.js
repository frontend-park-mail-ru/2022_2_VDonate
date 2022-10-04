/**
 * Модуль рендера страницы авторизации
 * @module auth
 */

import { processForm, formType } from "../modules/validationForm.js";

/**
 * @const {Object} contextLogIn обьект с контекстом страницы авторизации
 */
const contextLogIn = {
  formTitle: 'Вход',
  inputs: [
    {
      title: 'Псевдоним',
      placeholder: 'Username',
      name: 'username',
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

  const signlog = Handlebars.templates.signlog;
  const main = document.createElement('div');
  main.className = 'main';
  const frm = document.createElement('form');
  frm.className = 'form';
  frm.name = formType.login;
  // frm.onsubmit = () => {
  //   processForm(frm, router);
  //   return false;
  // };
  frm.addEventListener('submit', () => {
    processForm(frm, router);
    return false;
  });
  frm.innerHTML += signlog(contextLogIn);
  main.appendChild(frm)
  router.root.appendChild(main);

  const footer = Handlebars.templates.footer;
  router.root.innerHTML += footer();
}