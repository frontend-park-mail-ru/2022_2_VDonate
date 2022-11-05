import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {PayloadLocation} from './routing';

interface PayloadLogInSuccess {
  id: number
}

interface PayloadLogInFail {
  usernameErr: null | string
  passwordErr: null | string
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
    formStatus: PayloadLogInFail
  }
}

export interface ActionLogInFail extends IAction {
  type: ActionType.LOGIN_FAIL
  payload: PayloadLogInFail
}
