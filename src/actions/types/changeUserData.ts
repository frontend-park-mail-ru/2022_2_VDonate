import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

interface PayloadChangeUserData {
  success: boolean
  error: string | undefined
}

export interface ChangeUserDataForm extends HTMLCollection {
  email: HTMLInputElement
  username: HTMLInputElement
  password: HTMLInputElement
  repeatPassword: HTMLInputElement
}

export interface ActionChangeUserData extends IAction {
  type: ActionType.CHANGEUSERDATA
  payload: PayloadChangeUserData
}
