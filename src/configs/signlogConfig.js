import {inputType} from '@modules/validationForm.js';

/**
 * @const {Object} contextLogIn обьект с контекстом страницы авторизации
 */
export const contextLogIn = {
  formTitle: 'Вход',
  formName: 'login',
  inputs: [
    {
      title: 'Псевдоним',
      name: 'username',
      type: 'text',
    },
    {
      title: 'Пароль',
      name: 'password',
      type: 'password',
    },
  ],
  buttonTittle: 'Войти',
  orButton: {
    title: 'Зарегистрироваться',
    link: '/signup',
  },
};

export const logFields = [
  inputType.username,
  inputType.password,
];

/**
 * @const {Object} contextSignUp объект с контекстом страницы регистрации
 */
export const contextSignUp = {
  formTitle: 'Регистрация',
  formName: 'signup',
  inputs: [
    {
      title: 'Почта',
      name: 'email',
      type: 'text',
    },
    {
      title: 'Псевдоним',
      placeholder: '',
      name: 'username',
      type: 'text',
    },
    {
      title: 'Пароль',
      name: 'password',
      type: 'password',
    },
    {
      title: 'Повторите пароль',
      name: 'passwordRepeat',
      type: 'password',
    },
  ],
  buttonTittle: 'Зарегистрироваться',
  orButton: {
    title: 'Войти',
    link: '/login',
  },
};

export const signFields = [
  inputType.email,
  inputType.username,
  inputType.password,
  inputType.repeatPassword,
];
