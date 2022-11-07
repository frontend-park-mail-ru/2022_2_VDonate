import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
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
  username: null | string
  password: null | string
}
/** Нагрузка в срез ошибок формы регистрации */
export interface PayloadSignUpErrors {
  email: null | string
  username: null | string
  password: null | string
  repeatPassword: null | string
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


