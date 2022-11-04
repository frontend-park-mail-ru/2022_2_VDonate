import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {PayloadLocation} from './routing';

interface PayloadLogIn {
  id: number
}

export interface ActionLogIn extends IAction {
  type: ActionType.LOGIN
  payload: {
    login: PayloadLogIn
    location: PayloadLocation
  }
}

export interface LoginForm extends HTMLCollection {
  username: HTMLInputElement
  password: HTMLInputElement
}
