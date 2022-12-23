/**
 * Модуль валидации и обработки полей ввода
 * @module Validation
 */

/**
 * Ограничения длин полей
 * @namespace
 * @property {number} localMax максимальная длина локальной части почты
 * @property {number} domainLabel максимальная длина одного уровня доменной
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
  domainLabel: {
    min: 1,
    max: 63,
  },
  username: {
    min: 3,
    max: 20,
  },
  password: {
    min: 5,
    max: 30,
  },
  title: {
    min: 1,
    max: 30,
  },
  text: {
    min: 1,
    max: 128,
  },
  tier: {
    min: 1,
    max: 10000, // 10k
  },
  price: {
    min: 1,
    max: 1000000000, // 1 миллиард
  },
};

export const commentSize = 100;

/**
 * Проверка строки почты на верный формат
 * @param email - строка для валидации почты
 * @return null или сообщение об ошибке
 */
export const emailCheck = (email: string): string | null => {
  const emailSplit = email.split('@');
  if (emailSplit.length != 2) {
    return 'Неверная почта. Пример: name@email.ru';
  }

  const local = emailSplit[0];
  if (local.length < sizes.localEmail.min) {
    return `Неверная почта. Символов до @ меньше ${sizes.localEmail.min}`;
  }
  if (local.length > sizes.localEmail.max) {
    return `Неверная почта. Символов до @ больше ${sizes.localEmail.max}`;
  }

  const domain = emailSplit[1];
  const domainLabels = domain.split('.');
  if (domainLabels.length < 2) {
    return 'Неверная почта. После @ должно быть минимум 2 подуровня';
  }
  if (domainLabels.reduce((prev, current) => prev ||
    current.length < sizes.domainLabel.min, false)) {
    return `Неверная почта. 
    Символов после @ в одном подуровне меньше ${sizes.domainLabel.min}`;
  }
  if (domainLabels.reduce((prev, current) => prev ||
    current.length > sizes.domainLabel.max, false)) {
    return `Неверная почта. 
    Символов после @ в одном подуровне больше ${sizes.domainLabel.max}`;
  }

  const localReg =
    /^[\w\d!#$%&'*+\-/=?^`{|}~]+(\.[\w\d!#$%&'*+\-/=?^`{|}~]+)*$/;
  if (!localReg.test(local)) {
    return `Неверная почта. До @ разрешены латиница, числа, символы 
    !#$%&'*+-/=?^_\`{|}~ и точка-разделитель`;
  }

  const domainReg = /[0-9a-zA-Z]+([.-]?[0-9a-zA-Z]+)*(\.[0-9a-zA-Z]+)$/;
  if (!domainReg.test(domain)) {
    return `Неверная почта. После @ разрешены латиница, 
    числа и точка-разделитель`;
  }

  return null;
};

/**
 * Проверка строки ввода псевдонима на верный формат
 * @param username - строка для валидации псевдонима
 * @return null или сообщение об ошибке
 */
export const usernameCheck = (username: string): null | string => {
  if (username.length < sizes.username.min) {
    return `Символов в псевдониме меньше ${sizes.username.min}`;
  }

  if (username.length > sizes.username.max) {
    return `Символов в псевдониме больше ${sizes.username.max}`;
  }

  const usernameReg = /^[\d\wа-яёА-ЯЁ]+( [\d\wа-яёА-ЯЁ]+)*$/;
  if (!usernameReg.test(username)) {
    return `В псевдониме разрешены латиница, кириллица, числа, знак нижнего 
    подчеркивания и пробел между словами`;
  }


  return null;
};

/**
 * Проверка строки ввода пароля на верный формат
 * @param password - строка для валидации пароля
 * @return null или сообщение об ошибке
 */
export const passwordCheck = (password: string): null | string => {
  if (password.length < sizes.password.min) {
    return `Символов в пароле меньше ${sizes.password.min}`;
  }
  if (password.length > sizes.password.max) {
    return `Символов в пароле больше ${sizes.password.max}`;
  }
  const passwordReg = /^[\w!@#$%^&* ]+$/;
  if (!passwordReg.test(password)) {
    return `В пароле разрешены только латиница, числа, символы !@#$%^&*_ и 
    пробелы`;
  }

  return null;
};

/**
 * Проверка строки повторного ввода пароля совпадение с полем ввода пароля
 * @param {Element} origin строка для валидации пароля
 * @param {Element} repeat элемент повторного ввода пароля
 * @return null или сообщение об ошибке
 */
export const repeatPasswordCheck = (
    origin: string,
    repeat: string): null | string => {
  if (repeat.length === 0) {
    return 'Поле повторного пароля не может быть пустым';
  }
  if (origin !== repeat) {
    return 'Поле повторного пароля должно совпадать с полем пароля';
  }

  return null;
};

/**
 * @param price строка для валидации
 * @returns null или сообщение об ошибке
 */
export const priceCheck = (price: string): null | string => {
  const priceReg = /^[-+0-9]?[0-9]*$/;
  if (!priceReg.test(price)) {
    return 'Укажите цену, используя только цифры';
  }
  if (Number(price) < sizes.price.min) {
    return `Укажите цену не меньше ${sizes.price.min}`;
  }
  if (Number(price) > sizes.price.max) {
    return `Укажите цену не больше ${sizes.price.max}`;
  }
  return null;
};

/**
 * Проверка строки ввода заголовка
 * @param title - строка для валидации псевдонима
 * @return null или сообщение об ошибке
 */
export const titleCheck = (title: string): null | string => {
  if (title.length < sizes.title.min) {
    return `Символов в заголовке меньше ${sizes.title.min}`;
  }
  if (title.length > sizes.title.max) {
    return `Символов в заголовке больше ${sizes.title.max}`;
  }
  const titleReg = /^[\d\w!@#$%^&*а-яёА-ЯЁ]+( [\d\w!@#$%^&*а-яёА-ЯЁ]+)*$/;
  if (!titleReg.test(title)) {
    return `В заголовке разрешены латиница, кириллица, числа, 
    символы !@#$%^&*_ и пробел между словами`;
  }
  return null;
};

/**
 * Проверка строки ввода текста мотивации
 * @param text - строка для валидации текста
 * @return null или сообщение об ошибке
 */
export const textCheck = (text: string): null | string => {
  if (text.length < sizes.text.min) {
    return `Символов в тексте меньше ${sizes.text.min}`;
  }
  if (text.length > sizes.text.max) {
    return `Символов в тексте больше ${sizes.text.max}`;
  }
  return null;
};

export const deleteSpacebarsAndEnters = (text: string): string => {
  while ((text.startsWith(' ') ||
          text.endsWith(' ') ||
          text.match(/^&nbsp;/) ||
          text.match(/&nbsp;$/) ||
          text.match(/<div>(<br>){0,}(&nbsp;){0,}( &nbsp;){0,}<\/div>$/) ||
          text.match(/^<div>(<br>){0,}(&nbsp;){0,}( &nbsp;){0,}<\/div>/)) &&
          text.length != 0) {
    text = text.trim()
        .replace(/^<div>(<br>){0,}(&nbsp;){0,}( &nbsp;){0,}<\/div>/, '')
        .replace(/<div>(<br>){0,}(&nbsp;){0,}( &nbsp;){0,}<\/div>$/, '')
        .replace(/^&nbsp;/, '')
        .replace(/&nbsp;$/, '');
  }
  return text;
};
