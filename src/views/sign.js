/**
 * Модуль рендера страницы авторизации
 * @module sign
 */

import processForm from "../modules/validationForm.js";

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
      placeholder: 'My username',
      name: 'username',
      type: 'text',
    },
    {
      title: 'Пароль',
      placeholder: 'Любые символы, кроме пробелов',
      name: 'password',
      type: 'password',
    },
    {
      title: 'Повторите пароль',
      placeholder: 'Любые символы, кроме пробелов',
      name: 'passwordRepeat',
      type: 'password',
    },
  ],
  buttonTittle: 'Зарегистрироваться',
  orButton: {
    title: 'Войти',
    link: '/signin',
  }
};


/**
 * Функция, которая рендерит страницу регистрации
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
  frm.innerHTML += form(contextSignUp);
  el.appendChild(frm)
  router.root.appendChild(el);

  const footer = Handlebars.templates.footer;
  router.root.innerHTML += footer();
}