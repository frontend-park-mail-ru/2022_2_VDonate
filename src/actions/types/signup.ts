import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {PayloadLocation} from './routing';

interface PayloadSignUpSuccess {
  id: number
}

interface PayloadSignUpFail {
  emailErr: null | string
  usernameErr: null | string
  passwordErr: null | string
  passwordRepeatErr: null | string
}

export interface SignUpForm extends HTMLCollection {
  email: HTMLInputElement
  username: HTMLInputElement
  password: HTMLInputElement
  passwordRepeat: HTMLInputElement
}

export interface ActionSignUpSuccess extends IAction {
  type: ActionType.SIGNUP_SUCCESS
  payload: {
    signup: PayloadSignUpSuccess
    location: PayloadLocation
    formStatus: PayloadSignUpFail
  }
}

export interface ActionSignUpFail extends IAction {
  type: ActionType.SIGNUP_FAIL
  payload: PayloadSignUpFail
}
