import {ActionType} from 'src/configs/actionConfig';
import {IAction} from 'src/modules/flux/types/actions';

export interface PayloadLogIn {
  username: string
  password: string
}

export interface ActionLogIn extends IAction {
  type: ActionType.LOGIN
  payload: PayloadLogIn
}
