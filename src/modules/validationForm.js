/**
 * Модуль валидации и обработки формы
 * @module processForm
 */

/**
 * Виды полей ввода
 * @readonly
 * @enum {string}
 */
const inputType = {
  username: 'username',
  password: 'password',
  repeatPassword: 'repeatPassword',
  email: 'email',
};

/**
 * @typedef {Object} errorMessage
 * @property {inputType} input
 * @property {string} message
 */

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
    min: 5,
    max: 20,
  },
  password: {
    min: 5,
    max: 30,
  },
};

/**
 * Проверка на допустимую длину локальную и доменную часть почтового адреса
 * @param {string} email валидный по формату почтовый адрес
 * @returns {bool}
 */
const emailLengthCheck = (email) => {
  const tmpSplit = email.split('@');
  const local = tmpSplit[0];
  const domain = tmpSplit[1].split('.');
  if (local.length <= sizes.localMax
    && domain.reduce((prev, current) => prev && current.length <= sizes.domainLableMax, true)) {
    return true;
  }
  return false;
};

/**
 * Проверка поля ввода почты на верный формат
 * @param {Element} email элемент ввода почты
 * @returns {bool} результат проверки
 */
const emailCheck = (email) => {
  const localSyms = /[a-zA-Z0-9!#$&%_+-]/;
  const localReg = new RegExp(`^${localSyms.source}+(\\.?${localSyms.source}+)*`);
  const domainReg = /[0-9a-zA-Z]([\.-]?[0-9a-zA-Z]+)*$/;
  const emailReg = new RegExp(`${localReg.source}@${domainReg.source}`);
  if (emailReg.test(email.value) && emailLengthCheck(email.value)) {
    email.className = 'input__input';
    return true;
  }
  email.className = 'input__input input__input_error';
  return false;
};

/**
 * Проверка поля ввода псевдонима на верный формат
 * @param {Element} username элемент ввода псевдонима
 * @returns {bool} результат проверки
 */
const usernameCheck = (username) => {
  const usernameSyms = /[\d\wа-яёА-ЯЁ]/;
  const usernameReg = new RegExp(`^${usernameSyms.source}( ?${usernameSyms.source})*$`);
  if (username.value.length >= sizes.username.min
    && username.value.length <= sizes.username.max
    && usernameReg.test(username.value)) {
    username.className = 'input__input';
    return true;
  }
  username.className = 'input__input input__input_error';
  return false;
};

/**
 * Проверка поля ввода пароля на верный формат
 * @param {Element} password элемент ввода пароля
 * @returns {bool} результат проверки
 */
const passwordCheck = (password) => {
  if (password.value.length >= sizes.password.min
    && password.value.length <= sizes.password.max
    && /^.+$/.test(password.value)) {
    password.className = 'input__input';
    return true;
  }
  password.className = 'input__input input__input_error';
  return false;
};

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
};

/**
 * Валидация формы
 * @param {HTMLFormElement} form элемент формы регистрации для валидации
 * @param {...inputType} formFields список входных полей формы
 * @returns {errorMessage[] | undefined} результат проверки
 */
const validationForm = (form, ...formFields) => {
  const inputs = form.querySelectorAll('.input__input');
  let errors;
  inputs.forEach((input, idx) => {
    switch (formFields[idx]) {
      case inputType.username:
        errors.push(usernameCheck(input));
        break;
      case inputType.email:
        errors.push(emailCheck(input));
        break;
      case inputType.password:
        errors.push(passwordCheck(input));
        break;
      case inputType.repeatPassword:
        errors.push(repeatPasswordCheck(input));
        break;
      default:
        break;
    }
  })
  return errors;
};

/**
 * Отображение ошибок валидации
 * @param {HTMLFormElement} form
 * @param {...errorMessage} errors 
 */
const displayErrors = (form, ...errors) => {
  if (errors.length == 0) {
    const errorMsgs = form.querySelectorAll('.input__error');
    errorMsgs.forEach((inputErr) => {
      inputErr.className = 'input__error input__error_disable';
    })
    const inputs = form.querySelectorAll('.input__input');
    inputs.forEach((input) => {
      input.className = 'input__input';
    })
  }
}

/**
 * Функция отправки запроса по форме
 * @callback sendFormRequest
 * @param {HTMLFormElement} responseCode
 * @returns {errorMessage[]} 
 */

/**
 * Обработка формы
 * @param {HTMLFormElement} form
 * @param {sendFormRequest} formRequest функция обработки запроса формы 
 * @param {...inputType} formFields список входных полей формы
 * на сервер
 */
export default function processForm(form, formRequest, ...formFields) {
  alert();
  let errors = validationForm(form, formFields);
  if (errors === undefined) {
    errors = formRequest(form);
  }
  displayErrors(errors);
}
