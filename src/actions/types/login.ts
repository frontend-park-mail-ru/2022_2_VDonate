import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {PayloadLocation} from './routing';

export interface PayloadLogInSuccess {
  id: number
}

export interface PayloadLogInErrors {
  username: null | string
  password: null | string
}

export interface LogInForm extends HTMLCollection {
  username: HTMLInputElement
  password: HTMLInputElement
}

export interface ActionLogInSuccess extends IAction {
  type: ActionType.LOGIN_SUCCESS
  payload: {
    login: PayloadLogInSuccess
    location: PayloadLocation
    formErrors: PayloadLogInErrors
  }
}

export interface ActionLogInFail extends IAction {
  type: ActionType.LOGIN_FAIL
  payload: PayloadLogInErrors
}
