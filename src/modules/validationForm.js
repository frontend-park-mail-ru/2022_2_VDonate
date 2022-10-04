/**
 * Виды форм
 * @enum {string}
 */
const formType = {
  signup: 'signup',
  login: 'login',
}

/**
 * Длины полей
 * @type {object}
 * @property {int} local длина локальной части почты
 * @property {int} domainLable длина одного уровня доменной части почты
 */
const sizes = {
  local: 64,
  domainLable: 63,
  username: {
    min: 1,
    max: 20,
  },
  password: {
    min: 6,
    max: 30
  }
}

/**
 * Проверка на допустимую длину локальную и доменную часть почтового адреса
 * @param {string} email валидный почтовый адрес 
 * @returns {bool}
 */
const emailLengthCheck = email => {
  const tmpSplit = email.split('@');
  const local = tmpSplit[0];
  const domain = tmpSplit[1].split('.');
  if (local.length <= sizes.local
    && domain.reduce((prev, current) => {
      return prev && current.length <= sizes.domainLable
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
  const domainReg = /[0-9a-zA-Z]+([\.-]?[0-9a-zA-Z]+)*(\.?[0-9a-zA-Z]+)$/;
  const emailReg = new RegExp(localReg.source + '@' + domainReg.source);
  if (emailReg.test(email.value) && emailLengthCheck(email.value)) {
    email.style = '';
    return true;
  }
  email.style.borderColor = 'red';
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
    username.style = '';
    return true;
  }
  username.style.borderColor = 'red';
  return false;
}

/**
 * Проверка поля ввода пароля на верный формат
 * @param {Element} password элемент ввода пароля
 * @returns {bool} результат проверки
 */
const passwordCheck = password => {
  if (/^[\S]+$/.test(password.value)) {
    password.style = '';
    return true;
  }
  password.style.borderColor = 'red';
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
  const errText = form.querySelector('#error-text');
  if (emailChecked && passwordChecked) {
    errText.style = '';
    return true;
  }
  errText.style.display = 'unset';
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
  const errText = form.querySelector('#error-text');
  if (emailChecked && passwordChecked && usernameChecked && repeatChecked) {
    errText.style = '';
    return true;
  }
  errText.style.display = 'unset';
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
  if (validationForm(form)) {
    form.reset();
  }
}