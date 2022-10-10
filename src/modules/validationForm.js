/**
 * Модуль валидации и обработки формы
 * @module processForm
 */

/**
 * Виды полей ввода
 * @readonly
 * @enum {string}
 */
export const inputType = {
  username: 'username',
  password: 'password',
  repeatPassword: 'repeatPassword',
  email: 'email',
};

/**
 * @typedef {Map<number, string>} errorMessage
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
  localEmail: {
    min: 1,
    max: 64,
  },
  domainLable: {
    min: 1,
    max: 63,
  },
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
 * Проверка поля ввода почты на верный формат
 * @param {HTMLInputElement} email элемент ввода почты
 * @return {bool} результат проверки
 */
const emailCheck = (email) => {
  email.className = 'input__input input__input_error';

  const emailSplit = email.value.split('@');
  if (emailSplit.length != 2) {
    return 'Пример: name@email.ru';
  }

  const local = emailSplit[0];
  if (local.length < sizes.localEmail.min) {
    return `Длина имени ${sizes.localEmail.min}+`;
  }
  if (local.length > sizes.localEmail.max) {
    return `Длина имени до ${sizes.localEmail.max}`;
  }

  const domain = emailSplit[1];
  const domainLables = domain.split('.');
  if (domainLables.reduce((prev, current) => prev ||
    current.length < sizes.domainLable.min, false)) {
    return `Длина уровня домена ${sizes.domainLable.min}+`;
  }
  if (domainLables.reduce((prev, current) => prev ||
    current.length > sizes.domainLable.max, false)) {
    return `Длина уровня домена от ${sizes.domainLable.max}`;
  }

  const localReg =
    /^[\w\d!#$%&'*+\-/=?^`{|}~]+(\.[\w\d!#$%&'*+\-/=?^`{|}~]+)*$/;
  if (!localReg.test(local)) {
    return 'Ошибка имени: A-z, 0-9, !#$%&\'*+-/=?^_`{|}~ и точка-разделитель';
  }

  const domainReg = /[0-9a-zA-Z]+([.-]?[0-9a-zA-Z]+)*(\.[0-9a-zA-Z]+)$/;
  if (!domainReg.test(domain)) {
    return 'Ошибка домена: A-z, 0-9 и точка-разделитель';
  }

  email.className = 'input__input';
  return undefined;
};

/**
 * Проверка поля ввода псевдонима на верный формат
 * @param {Element} username элемент ввода псевдонима
 * @return {errorMessage} результат проверки
 */
const usernameCheck = (username) => {
  const usernameSyms = /[\d\wа-яёА-ЯЁ]/;
  const usernameReg =
    new RegExp(`^${usernameSyms.source}( ?${usernameSyms.source})*$`);
  username.className = 'input__input input__input_error';
  if (username.value.length < sizes.username.min) {
    return `Минимальная длина ${sizes.username.min}`;
  }
  if (username.value.length > sizes.username.max) {
    return `Максимальная длина ${sizes.username.max}`;
  }
  if (!usernameReg.test(username.value)) {
    return `Только A-z, А-я, 0-9, _ и пробел между словами`;
  }
  username.className = 'input__input';
  return undefined;
};

/**
 * Проверка поля ввода пароля на верный формат
 * @param {Element} password элемент ввода пароля
 * @return {bool} результат проверки
 */
const passwordCheck = (password) => {
  password.className = 'input__input input__input_error';
  if (password.value.length < sizes.password.min) {
    return `Минимальная длина ${sizes.password.min}`;
  }
  if (password.value.length > sizes.password.max) {
    return `Максимальная длина ${sizes.password.max}`;
  }
  if (!/^.+$/.test(password.value)) {
    return 'Недопустимый псевдоним';
  }
  password.className = 'input__input';
  return undefined;
};

/**
 * Проверка поля повторного ввода пароля совподение с полем ввода пароля
 * @param {Element} origin элемент ввода пароля
 * @param {Element} repeat элемент повторного ввода пароля
 * @return {bool} результат проверки
 */
const repeatPasswordCheck = (origin, repeat) => {
  repeat.className = 'input__input input__input_error';
  if (repeat.value.length === 0) {
    return 'Поле не может быть пустым';
  }
  if (origin.value !== repeat.value) {
    return 'Не совпадает';
  }
  repeat.className = 'input__input';
  return undefined;
};

/**
 * Валидация формы
 * @param {HTMLFormElement} form элемент формы регистрации для валидации
 * @param {inputType[]} formFields список входных полей формы
 * @return {errorMessage[] | undefined} результат проверки
 */
const validationForm = (form, formFields) => {
  const inputs = form.querySelectorAll('.input__input');
  const errors = new Map();
  inputs.forEach((input, idx, arr) => {
    let err;
    switch (formFields[idx]) {
      case inputType.username:
        err = usernameCheck(input);
        break;
      case inputType.email:
        err = emailCheck(input);
        break;
      case inputType.password:
        err = passwordCheck(input);
        break;
      case inputType.repeatPassword:
        err = repeatPasswordCheck(arr[idx - 1], input);
        break;
      default:
        break;
    }
    if (err !== undefined) {
      errors.set(idx, err);
    }
  });
  return errors;
};

/**
 * Отображение ошибок валидации
 * @param {HTMLFormElement} form
 * @param {errorMessage} errorMsgs
 */
const displayErrors = (form, errorMsgs) => {
  if (errorMsgs.size === 0) {
    const errorMsgs = form.querySelectorAll('.input__error');
    errorMsgs.forEach((inputErr) => {
      inputErr.className = 'input__error input__error_disable';
    });
    const inputs = form.querySelectorAll('.input__input');
    inputs.forEach((input) => {
      input.className = 'input__input';
    });
    return;
  }
  const errors = form.querySelectorAll('.input__error');
  errors.forEach((err, idx) => {
    if (errorMsgs.has(idx)) {
      err.className = 'input__error input__error_enable';
      err.textContent = errorMsgs.get(idx);
    } else {
      err.className = 'input__error input__error_disable';
    }
  });
};

/**
 * Функция отправки запроса по форме
 * @callback sendFormRequest
 * @param {HTMLFormElement} responseCode
 * @param {errorMessage} errors
 * @returns {Promise}
 */

/**
 * Обработка формы
 * @param {HTMLFormElement} form
 * @param {sendFormRequest} formRequest функция обработки запроса формы
 * @param {inputType[]} formFields список входных полей формы
 * на сервер
 */
export async function processingForm(form, formRequest, formFields) {
  const errors = validationForm(form, formFields);
  if (errors.size === 0) {
    await formRequest(form, errors);
  }
  displayErrors(form, errors);
}
