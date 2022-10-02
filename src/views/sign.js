/**
 * Модуль рендера страницы авторизации
 * @module sign
 */


/**
 * @const {Object} contextReg объект с контекстом страницы регистрации
 */
const contextSignUp = {
  formTitle: 'Регистрация',
  formName: 'signup',
  inputs: [
    {
      title: 'Почта',
      name: 'email',
      type: 'text',
    },
    {
      title: 'Никнейм',
      name: 'username',
      type: 'text',
    },
    {
      title: 'Пароль',
      name: 'password',
      type: 'password',
    },
    {
      title: 'Повторите пароль',
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

import { validationForm, formType } from '../modules/validationForm.js';

/**
 * Функция, которая рендерит страницу регистрации
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default async (router) => {
  router.root.innerHTML = '';

  const el = document.createElement('div');
  el.className = 'main';
  const fr = document.createElement('form');
  fr.className = 'form';
  fr.onsubmit = function () {
    validationForm(formType.signup);
  };
  fr.setAttribute("name", formType.signup);
  const signlog = Handlebars.templates.signlog;
  fr.innerHTML = signlog(contextSignUp);
  el.appendChild(fr);
  router.root.appendChild(el);
  const footer = Handlebars.templates.footer;
  router.root.innerHTML += footer();
}