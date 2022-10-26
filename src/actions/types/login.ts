import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

interface PayloadLogIn {
  id: number
}

export interface ActionLogIn extends IAction {
  type: ActionType.LOGIN
  payload: PayloadLogIn
}

export interface LoginForm extends HTMLCollection{
  username: HTMLInputElement
  password: HTMLInputElement
}
