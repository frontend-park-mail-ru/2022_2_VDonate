/**
 * Модуль рендера страницы авторизации
 * @module signup
 */

import {inputType, processingForm} from '../modules/validationForm.js';

/**
 * @const {Object} contextSignUp объект с контекстом страницы регистрации
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
      title: 'Псевдоним',
      placeholder: '',
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
    link: '/login',
  },
};

const formFields = [
  inputType.email,
  inputType.username,
  inputType.password,
  inputType.repeatPassword,
];

/**
 * Функция, которая рендерит страницу регистрации
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default async (router) => {
  router.main.innerHTML = '';

  const {signlog} = Handlebars.templates;
  router.main.innerHTML += signlog(contextSignUp);

  const sendFormRequest = async (form, errors) => {
    const res = await router.api.signupUser(
        form.username.value,
        form.email.value,
        form.password.value,
    );
    switch (res.status) {
      case 200:
        router.id = res.body.id;
        router.goTo(`/profile?id=${res.body.id}`);
        break;
      case 409:
        errors.set(0, 'Или почта уже занята...');
        errors.set(1, 'Или псевдоним уже занят...');
        break;
      case 500:
        errors.set(0, 'Внутренняя ошибка сервера!');
        errors.set(1, 'Внутренняя ошибка сервера!');
        errors.set(2, 'Внутренняя ошибка сервера!');
        errors.set(3, 'Внутренняя ошибка сервера!');
        break;
      default:
        errors.set(0, 'АХТУНГ! Нас тут быть не должно!');
        errors.set(1, 'АХТУНГ! Нас тут быть не должно!');
        errors.set(2, 'АХТУНГ! Нас тут быть не должно!');
        errors.set(3, 'АХТУНГ! Нас тут быть не должно!');
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
