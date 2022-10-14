/**
 * Модуль рендера страницы авторизации
 * @module signup
 */

import {processingForm} from '@modules/validationForm.js';
import signlogTemplate from '@template/signlog.handlebars';
import {contextSignUp, signFields} from '@configs/signlogConfig.js';

/**
 * Функция, которая рендерит страницу регистрации
 * @param {App} app Основной класс веб-приложения
 */
export default async (app) => {
  app.main.innerHTML = '';
  app.main.innerHTML += signlogTemplate(contextSignUp);

  const sendFormRequest = async (form, errors) => {
    const res = await app.api.signupUser(
        form.username.value,
        form.email.value,
        form.password.value,
    );
    switch (res.status) {
      case 200:
        app.id = res.body.id;
        app.router.goTo(`/profile?id=${res.body.id}`);
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

  const form = app.main.querySelector('.form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    processingForm(form, sendFormRequest, signFields);
  }, false);
};
