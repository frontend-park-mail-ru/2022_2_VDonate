import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export interface PayloadChangeUserData {
  id: number
  username?: string
  email?: string
  about?: string
  password?: string
  repeatPassword?: string
  isAuthor?: boolean
}

/** Нагрузка в срез ошибок формы регистрации */
export interface PayloadChangeUserDataErrors {
  email: null | string
  username: null | string
  password: null | string
  repeatPassword: null | string
  about: null | string
  isAuthor: null | string
  avatar: null | string
}

export interface ChangeUserDataForm extends HTMLCollection {
  email: HTMLInputElement
  username: HTMLInputElement
  password: HTMLInputElement
  repeatPassword: HTMLInputElement
  isAuthor: HTMLInputElement | undefined
}

/** Интерфейс действия успешной регистрации */
export interface ActionChangeUserDataSuccess extends IAction {
  type: ActionType.CHANGEUSERDATA_SUCCESS
  payload: {
    user: PayloadChangeUserData
    formErrors: PayloadChangeUserDataErrors
  }
}

/** Интерфейс действия провальной регистрации */
export interface ActionChangeUserDataFail extends IAction {
  type: ActionType.CHANGEUSERDATA_FAIL
  payload: PayloadChangeUserDataErrors
}


