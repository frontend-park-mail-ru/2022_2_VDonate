import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {PayloadLocation} from './routing';

export interface PayloadSignUpSuccess {
  id: number
}

export interface PayloadSignUpErrors {
  email: null | string
  username: null | string
  password: null | string
  repeatPassword: null | string
}

export interface SignUpForm extends HTMLCollection {
  email: HTMLInputElement
  username: HTMLInputElement
  password: HTMLInputElement
  repeatPassword: HTMLInputElement
}

export interface ActionSignUpSuccess extends IAction {
  type: ActionType.SIGNUP_SUCCESS
  payload: {
    signup: PayloadSignUpSuccess
    location: PayloadLocation
    formErrors: PayloadSignUpErrors
  }
}

export interface ActionSignUpFail extends IAction {
  type: ActionType.SIGNUP_FAIL
  payload: PayloadSignUpErrors
}
