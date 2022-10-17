/**
 * Модуль рендера страницы авторизации
 * @module login
 */

import {processingForm} from '@modules/validationForm.js';
import signlogTemplate from '@template/signlog.handlebars';
import {contextLogIn, logFields} from '@configs/signlogConfig';

/**
 * Функция, которая рендерит страницу авторизации
 * @param {App} app Основной класс веб-приложения
 */
export default async (app) => {
  app.main.innerHTML = signlogTemplate(contextLogIn);

  const sendFormRequest = async (form, errors) => {
    const res = await app.api.loginUser(form.username.value,
        form.password.value);
    switch (res.status) {
      case 200:
        app.id = res.body.id;
        app.router.goTo(`/profile?id=${res.body.id}`);
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

  const form = app.main.querySelector('.form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    processingForm(form, sendFormRequest, logFields);
  }, false);
};
