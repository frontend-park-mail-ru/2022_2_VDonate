import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

interface PayloadAuth {
  id: number
}

export interface ActionAuth extends IAction {
  type: ActionType.AUTH
  payload: PayloadAuth
}
