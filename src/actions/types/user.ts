import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {FormErrorType} from './formError';
import {PayloadLocation} from './routing';
/** Нагрузка в срез пользователя */
export interface PayloadUser {
  id: number
  avatar: string
  isAuthor: boolean
  username: string
  email: string
  countSubscriptions: number
  countSubscribers?: number
  about?: string
}
/** Нагрузка в срез ошибок формы авторизации */
export interface PayloadLogInErrors {
  type: FormErrorType.LOGIN
  username: null | string
  password: null | string
}
/** Нагрузка в срез ошибок формы регистрации */
export interface PayloadSignUpErrors {
  type: FormErrorType.SIGNUP
  email: null | string
  username: null | string
  password: null | string
  repeatPassword: null | string
}
/** Нагрузка в срез пользователя при редактировании */
export interface PayloadEditUser {
  id: number
  username?: string
  email?: string
  about?: string
  password?: string
  repeatPassword?: string
  isAuthor?: boolean
  file?: File
}
/** Нагрузка в срез ошибок формы редактирования пользователя */
export interface PayloadEditUserErrors {
  type: FormErrorType.EDIT_USER
  email: null | string
  username: null | string
  password: null | string
  repeatPassword: null | string
  about: null | string
  isAuthor: null | string
  avatar: null | string
}
/** Интерфейс действия аутификации */
export interface ActionAuth extends IAction {
  type: ActionType.AUTH
  payload: {
    user: PayloadUser
    location: PayloadLocation
  }
}
/** Интерфейс действия успешной регистрации */
export interface ActionSignUpSuccess extends IAction {
  type: ActionType.SIGNUP_SUCCESS
  payload: {
    user: PayloadUser
    location: PayloadLocation
    formErrors: PayloadSignUpErrors
  }
}
/** Интерфейс действия провальной регистрации */
export interface ActionSignUpFail extends IAction {
  type: ActionType.SIGNUP_FAIL
  payload: PayloadSignUpErrors
}
/** Интерфейс действия успешной авторизации */
export interface ActionLogInSuccess extends IAction {
  type: ActionType.LOGIN_SUCCESS
  payload: {
    user: PayloadUser
    location: PayloadLocation
    formErrors: PayloadLogInErrors
  }
}
/** Интерфейс действия провальной авторизации */
export interface ActionLogInFail extends IAction {
  type: ActionType.LOGIN_FAIL
  payload: PayloadLogInErrors
}

/** Интерфейс действия успешного выхода */
export interface ActionLogOutSuccess extends IAction {
  type: ActionType.LOGOUT_SUCCESS
  payload: {
    location: PayloadLocation
  }
}
/** Интерфейс действия провального выхода */
export interface ActionLogOutFail extends IAction {
  type: ActionType.LOGOUT_FAIL
  payload: {
    message: string
  }
}
/** Интерфейс действия успешной регистрации */
export interface ActionEditUseDataSuccess extends IAction {
  type: ActionType.CHANGEUSERDATA_SUCCESS
  payload: {
    user: PayloadEditUser
    formErrors: PayloadEditUserErrors
  }
}
/** Интерфейс действия провальной регистрации */
export interface ActionEditUserFail extends IAction {
  type: ActionType.CHANGEUSERDATA_FAIL
  payload: PayloadEditUserErrors
}
