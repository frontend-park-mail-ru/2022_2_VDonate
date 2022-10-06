/**
 * Модуль валидации и обработки формы
 * @module processForm
 */

import Router from "./router.js";

/**
 * Виды форм
 * @enum {string}
 */
const formType = {
  signup: 'signup',
  login: 'login',
}

/**
 * Ограничения длин полей
 * @namespace
 * @property {number} localMax максимальная длина локальной части почты
 * @property {number} domainLableMax максимальная длина одного уровня доменной 
 * части почты
 * @property {object} username значения длин псевдонима
 * @property {number} username.max значение максимальной длины псевдонима
 * @property {number} username.min значение минимальной длины псевдонима
 * @property {object} password значения длин пароля
 * @property {number} password.max значение максимальной длины пароля
 * @property {number} password.min значение минимальной длины пароля
 */
const sizes = {
  localMax: 64,
  domainLableMax: 63,
  username: {
    min: 1,
    max: 20,
  },
  password: {
    min: 1,
    max: 30,
  },
}

/**
 * Проверка на допустимую длину локальную и доменную часть почтового адреса
 * @param {string} email валидный по формату почтовый адрес 
 * @returns {bool}
 */
const emailLengthCheck = email => {
  const tmpSplit = email.split('@');
  const local = tmpSplit[0];
  const domain = tmpSplit[1].split('.');
  if (local.length <= sizes.localMax
    && domain.reduce((prev, current) => {
      return prev && current.length <= sizes.domainLableMax
    }, true)) {
    return true
  }
  return false;
}

/**
 * Проверка поля ввода почты на верный формат
 * @param {Element} email элемент ввода почты
 * @returns {bool} результат проверки
 */
const emailCheck = email => {
  //eslint-disable-next-line
  const localSyms = /[a-zA-Z0-9!#\$&%_+-]/;
  const localReg = new RegExp(`^${localSyms.source}+(\\.?${localSyms.source}+)*`);
  //eslint-disable-next-line
  const domainReg = /[0-9a-zA-Z]([\.-]?[0-9a-zA-Z]+)*$/;
  const emailReg = new RegExp(localReg.source + '@' + domainReg.source);
  if (emailReg.test(email.value) && emailLengthCheck(email.value)) {
    email.className = 'input__input';
    return true;
  }
  email.className = 'input__input input__input_error';
  return false;
}

/**
 * Проверка поля ввода псевдонима на верный формат
 * @param {Element} username элемент ввода псевдонима
 * @returns {bool} результат проверки
 */
const usernameCheck = username => {
  const usernameSyms = /[\d\wа-яёА-ЯЁ]/;
  const usernameReg =
    new RegExp(`^${usernameSyms.source}( ?${usernameSyms.source})*$`);
  if (username.value.length >= sizes.username.min
    && username.value.length <= sizes.username.max
    && usernameReg.test(username.value)) {
    username.className = 'input__input';
    return true;
  }
  username.className = 'input__input input__input_error';
  return false;
}

/**
 * Проверка поля ввода пароля на верный формат
 * @param {Element} password элемент ввода пароля
 * @returns {bool} результат проверки
 */
const passwordCheck = password => {
  if (password.value.length >= sizes.password.min
    && password.value.length <= sizes.password.max
    && /^.+$/.test(password.value)) {
    password.className = 'input__input';
    return true;
  }
  password.className = 'input__input input__input_error';
  return false;
}

/**
 * Проверка поля повторного ввода пароля совподение с полем ввода пароля
 * @param {Element} origin элемент ввода пароля
 * @param {Element} repeat элемент повторного ввода пароля
 * @returns {bool} результат проверки
 */
const repeatPasswordCheck = (origin, repeat) => {
  if (repeat.value.length !== 0 && origin.value === repeat.value) {
    repeat.className = 'input__input';
    return true;
  }
  repeat.className = 'input__input input__input_error';
  return false;
}

/**
 * Проверка проверка формы входа на верный формат входных полей
 * @param {HTMLFormElement} form элемент формы входа для валидации
 * @returns {bool} результат проверки
 */
const loginValidation = form => {
  const usernameChecked = usernameCheck(form.username);
  const passwordChecked = passwordCheck(form.password);
  return usernameChecked && passwordChecked;
}

/**
 * Проверка проверка формы регистрации на верный формат входных полей
 * @param {HTMLFormElement} form элемент формы регистрации для валидации
 * @returns {bool} результат проверки
 */
const signupValidation = form => {
  const emailChecked = emailCheck(form.email);
  const passwordChecked = passwordCheck(form.password);
  const usernameChecked = usernameCheck(form.username);
  const repeatChecked = repeatPasswordCheck(form.password, form.passwordRepeat);
  return emailChecked && passwordChecked && usernameChecked && repeatChecked;
}

/**
 * Валидация формы
 * @param {HTMLFormElement} form элемент формы регистрации для валидации
 * @returns {bool} результат проверки
 */
const validationForm = form => {
  switch (form.name) {
    case formType.login:
      return loginValidation(form);
    case formType.signup:
      return signupValidation(form);
    default:
      return false;
  }
}

/**
 * Обработка формы
 * @param {HTMLFormElement} form 
 */
export default function processForm(form) {
  const errorMessage = form.querySelector('#error-msg');
  if (validationForm(form)) {
    errorMessage.className = 'form__error-msg form__error-msg_disable';
    sendRequest(form);
  } else {
    errorMessage.className = 'form__error-msg form__error-msg_enable';
    errorMessage.innerHTML = 'Неверно введены данные!';
  }
}

/**
 * Отправка запрос на авторизацию/регистрацию
 * @param {HTMLFormElement} form 
 */
function sendRequest(form) {
  const router = new Router();
  switch (form.name) {
    case formType.login:
      router.api.loginUser(form.username.value, form.password.value)
        .then(({ status, body }) => {
          validateOrLogin(router, form, status, body.id);
        });
      break;
    case formType.signup:
      router.api.signupUser(
        form.username.value,
        form.email.value,
        form.password.value
      )
        .then(({ status, body }) => {
          validateOrSignup(router, form, status, body.id);
        });
      break;
  }
}

/**
 * Валидация результата запроса формы на вход
 * @param {Router} router 
 * @param {HTMLFormElement} form форма, которая отправила запрос
 * @param {number} status код ответа
 * @param {number} id ID пользователя из результата отправки формы
 */
function validateOrLogin(router, form, status, id) {
  const errorMessage = form.querySelector('#error-msg');
  switch (status) {
    case 200:
      router.id = id;
      router.goTo(`/profile?id=${id}`);
      break;
    case 400:
      errorMessage.className = 'form__error-msg form__error-msg_enable';
      errorMessage.innerHTML = 'Неверно введен пароль!';
      form.password.className = 'input__input input__input_error';
      break;
    case 404:
      errorMessage.className = 'form__error-msg form__error-msg_enable';
      errorMessage.innerHTML = 'Пользователь не найден!';
      form.username.className = 'input__input input__input_error';
      break;
    case 500:
      errorMessage.className = 'form__error-msg form__error-msg_enable';
      errorMessage.innerHTML = 'Внутренняя ошибка сервера!';
      break;
    default:
      errorMessage.className = 'form__error-msg form__error-msg_enable';
      errorMessage.innerHTML = 'Ошибка, повторите попытку еще раз!';
      break;
  }
}

/**
 * Валидация результата запроса формы на регистрацию
 * @param {Router} router 
 * @param {HTMLFormElement} form форма, которая отправила запрос
 * @param {number} status код ответа
 * @param {number} id ID пользователя из результата отправки формы
 */
function validateOrSignup(router, form, status, id) {
  const errorMessage = form.querySelector('#error-msg');
  switch (status) {
    case 200:
      router.id = id;
      router.goTo(`/profile?id=${id}`);
      break;
    case 409:
      errorMessage.className = 'form__error-msg form__error-msg_enable';
      errorMessage.innerHTML = 'Пользователь с данной почтой или псевдонимом уже существует!';
      form.email.className = 'form__error-msg form__error-msg_enable';
      form.username.className = 'form__error-msg form__error-msg_enable';
      break;
    case 500:
      errorMessage.className = 'form__error-msg form__error-msg_enable';
      errorMessage.innerHTML = 'Внутренняя ошибка сервера!';
      break;
    default:
      errorMessage.className = 'form__error-msg form__error-msg_enable';
      errorMessage.innerHTML = 'Ошибка, повторите попытку еще раз!';
      break;
  }
}