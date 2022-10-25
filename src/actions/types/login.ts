import {IAction} from '@flux/types/actions';
import ActionType from '@configs/action';

export interface PayloadLogIn {
  username: string
  password: string
}

export interface ActionLogIn extends IAction {
  type: ActionType.LOGIN
  payload: PayloadLogIn
}

export interface LoginForm extends HTMLCollection{
  username: HTMLInputElement
  password: HTMLInputElement
}
