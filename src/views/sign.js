/**
 * Модуль рендера страницы авторизации
 * @module sign
 */

// import { processForm, formType } from "../modules/validationForm.js";

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
  // router.root.innerHTML = '';

  // const signlog = Handlebars.templates.signlog;
  // const main = document.createElement('div');
  // main.className = 'main';
  // const frm = document.createElement('form');
  // frm.className = 'form';
  // frm.name = formType.signup;
  // frm.onsubmit = () => {
  //   processForm(frm, router);
  //   return false;
  // };
  // frm.innerHTML += signlog(contextSignUp);
  // main.appendChild(frm)
  // router.root.appendChild(main);

  // const footer = Handlebars.templates.footer;
  // router.root.innerHTML += footer();
}