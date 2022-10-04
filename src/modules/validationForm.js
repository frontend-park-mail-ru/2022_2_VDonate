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
 * @property {int} localMax максимальная длина локальной части почты
 * @property {int} domainLableMax максимальная длина одного уровня доменной 
 * части почты
 * @property {object} username значения длин псевдонима
 * @property {int} username.max значение максимальной длины псевдонима
 * @property {int} username.min значение минимальной длины псевдонима
 * @property {object} password значения длин пароля
 * @property {int} password.max значение максимальной длины пароля
 * @property {int} password.min значение минимальной длины пароля
 */
const sizes = {
  localMax: 64,
  domainLableMax: 63,
  username: {
    min: 1,
    max: 20,
  },
  password: {
    min: 6,
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
  const localSyms = /[a-zA-Z0-9!#\$&%_+-]/;
  const localReg = new RegExp(`^${localSyms.source}+(\\.?${localSyms.source}+)*`);
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
  if (repeat.value != '' && origin.value === repeat.value) {
    repeat.style = '';
    return true;
  }
  repeat.style.borderColor = 'red';
  return false;
}

/**
 * Проверка проверка формы входа на верный формат входных полей
 * @param {HTMLFormElement} form элемент формы входа для валидации
 * @returns {bool} результат проверки
 */
function loginValidation(form) {
  const emailChecked = emailCheck(form.email);
  const passwordChecked = passwordCheck(form.password);
  if (emailChecked && passwordChecked) {
    return true;
  }
  return false;
}

/**
 * Проверка проверка формы регистрации на верный формат входных полей
 * @param {HTMLFormElement} form элемент формы регистрации для валидации
 * @returns {bool} результат проверки
 */
function signupValidation(form) {
  const emailChecked = emailCheck(form.email);
  const passwordChecked = passwordCheck(form.password);
  const usernameChecked = usernameCheck(form.username);
  const repeatChecked = repeatPasswordCheck(form.password, form.passwordRepeat);
  if (emailChecked && passwordChecked && usernameChecked && repeatChecked) {
    return true;
  }
  return false;
}

/**
 * Валидация формы
 * @param {HTMLFormElement} form элемент формы регистрации для валидации
 * @returns {bool} результат проверки
 */
function validationForm(form) {
  switch (form.name) {
    case formType.login:
      return loginValidation(form);
    case formType.signup:
      return signupValidation(form);
    default:
      return false;
  }
}

// HACK Пока как заглушка
function processForm(form) {
  const errorMessage = form.querySelector('#error-msg');
  if (validationForm(form)) {
    errorMessage.innerHTML = '';
    form.reset();
  } else {
    errorMessage.innerHTML = 'Неверно введены данные!';
  }
}