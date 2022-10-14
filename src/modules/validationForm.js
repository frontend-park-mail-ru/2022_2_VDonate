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
    return `Символов до @ меньше ${sizes.localEmail.min}`;
  }
  if (local.length > sizes.localEmail.max) {
    return `Символов до @ больше ${sizes.localEmail.max}`;
  }

  const domain = emailSplit[1];
  const domainLables = domain.split('.');
  if (domainLables.length < 2) {
    return 'После @ должно быть минимум 2 подуровня';
  }
  if (domainLables.reduce((prev, current) => prev ||
    current.length < sizes.domainLable.min, false)) {
    return `Символов после @ в одном подуровне меньше ${sizes.domainLable.min}`;
  }
  if (domainLables.reduce((prev, current) => prev ||
    current.length > sizes.domainLable.max, false)) {
    return `Символов после @ в одном подуровне больше ${sizes.domainLable.max}`;
  }

  const localReg =
    /^[\w\d!#$%&'*+\-/=?^`{|}~]+(\.[\w\d!#$%&'*+\-/=?^`{|}~]+)*$/;
  if (!localReg.test(local)) {
    return `До @ разрешены латиница, числа, символы !#$%&'*+-/=?^_\`{|}~ и 
    точка-разделитель`;
  }

  const domainReg = /[0-9a-zA-Z]+([.-]?[0-9a-zA-Z]+)*(\.[0-9a-zA-Z]+)$/;
  if (!domainReg.test(domain)) {
    return 'После @ разрешены латиница, числа и точка-разделитель';
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
  username.className = 'input__input input__input_error';

  if (username.value.length < sizes.username.min) {
    return `Символов в псевдониме меньше ${sizes.username.min}`;
  }

  if (username.value.length > sizes.username.max) {
    return `Символов в псевдониме больше ${sizes.username.max}`;
  }

  const usernameReg = /^[\d\wа-яёА-ЯЁ]+( [\d\wа-яёА-ЯЁ]+)*$/;
  if (!usernameReg.test(username.value)) {
    return `Разрешены латиница, кириллица, числа, знак нижнего подчеркивания и 
    пробел между словами`;
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
    return `Символов в пароле меньше ${sizes.password.min}`;
  }
  if (password.value.length > sizes.password.max) {
    return `Символов в пароле больше ${sizes.password.max}`;
  }
  const passwordReg = /^[\w!@#$%^&* ]+$/;
  if (!passwordReg.test(password.value)) {
    return 'Только латинца, числа, символы !@#$%^&*_ и пробелы';
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
    return 'Должно совпадать полем пароля';
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
