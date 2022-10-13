/**
 * Модуль рендера страницы авторизации
 * @module login
 */

import {inputType, processingForm} from '../modules/validationForm.js';

/**
 * @const {Object} contextLogIn обьект с контекстом страницы авторизации
 */
const contextLogIn = {
  formTitle: 'Вход',
  formName: 'login',
  inputs: [
    {
      title: 'Псевдоним',
      name: 'username',
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
  },
};

const formFields = [
  inputType.username,
  inputType.password,
];

/**
 * Функция, которая рендерит страницу авторизации
 * @param {Router} router Класс маршрутизации по
 * страницам сайта
 */
export default async (router) => {
  router.main.innerHTML = '';

  const {signlog} = Handlebars.templates;
  router.main.innerHTML += signlog(contextLogIn);

  const sendFormRequest = async (form, errors) => {
    const res = await router.api.loginUser(form.username.value,
        form.password.value);
    switch (res.status) {
      case 200:
        router.id = res.body.id;
        router.goTo(`/profile?id=${res.body.id}`);
        break;
      case 400:
        errors.set(1, 'Неверно введен пароль!');
        break;
      case 404:
        errors.set(0, 'Пользователь не найден!');
        break;
      case 500:
        errors.set(0, 'Внутренняя ошибка сервера!');
        errors.set(1, 'Внутренняя ошибка сервера!');
        break;
      default:
        errors.set(0, 'АХТУНГ! Нас тут быть не должно!');
        errors.set(1, 'АХТУНГ! Нас тут быть не должно!');
        break;
    }
    return;
  };

  const form = router.main.querySelector('.form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    processingForm(form, sendFormRequest, formFields);
  }, false);
};
