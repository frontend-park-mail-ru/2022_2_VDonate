/**
 * Модуль валидации и обработки полей ввода
 * @module Validation
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
  title: {
    min: 5,
    max: 30,
  },
  text: {
    min: 10,
    max: 250,
  },
  tier: {
    min: 1,
    max: 10,
  },
  price: {
    min: 3,
    max: 9,
  },
};

/**
 * Проверка строки почты на верный формат
 * @param email - строка для валидации почты
 * @return null или сообщение об ошибке
 */
export const emailCheck = (email: string): string | null => {
  const emailSplit = email.split('@');
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
    return `Разрешены латиница, кириллица, числа, знак нижнего подчеркивания и 
    пробел между словами`;
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
    return 'Только латинца, числа, символы !@#$%^&*_ и пробелы';
  }

  return null;
};

/**
 * Проверка строки повторного ввода пароля совподение с полем ввода пароля
 * @param {Element} origin строка для валидации пароля
 * @param {Element} repeat элемент повторного ввода пароля
 * @return null или сообщение об ошибке
 */
export const repeatPasswordCheck = (
    origin: string,
    repeat: string): null | string => {
  if (repeat.length === 0) {
    return 'Поле не может быть пустым';
  }
  if (origin !== repeat) {
    return 'Должно совпадать полем пароля';
  }

  return null;
};

/**
 * @param tier строка для валидации
 * @returns null или сообщение об ошибке
 */
export const tierCheck = (tier: string): null | string => {
  if (tier.length < sizes.tier.min) {
    return `Символов в уровне меньше ${sizes.tier.min}`;
  }
  if (tier.length > sizes.tier.max) {
    return `Символов в уровне больше ${sizes.tier.max}`;
  }
  const tierReg = /^[0-9]+$/;
  if (!tierReg.test(tier)) {
    return 'Укажите уровень используя только цифры';
  }
  return null;
};

/**
 * @param price строка для валидации
 * @returns null или сообщение об ошибке
 */
export const priceCheck = (price: string): null | string => {
  if (price.length < sizes.price.min) {
    return `Символов в цене меньше ${sizes.price.min}`;
  }
  if (price.length > sizes.price.max) {
    return `Символов в цене больше ${sizes.price.max}`;
  }
  const priceReg = /^[0-9]+$/;
  if (!priceReg.test(price)) {
    return 'Укажите  используя только цифры';
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
  const titleReg = /^[\d\wа-яёА-ЯЁ]+( [\d\wа-яёА-ЯЁ]+)*$/;
  if (!titleReg.test(title)) {
    return `Разрешены латиница, кириллица, числа, знак нижнего подчеркивания и 
    пробел между словами`;
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
    return `Символов в тексте мотивации меньше ${sizes.text.min}`;
  }
  if (text.length > sizes.text.max) {
    return `Символов в тексте мотивации больше ${sizes.text.max}`;
  }
  return null;
};


