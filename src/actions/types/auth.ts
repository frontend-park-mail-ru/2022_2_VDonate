import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {PayloadLocation} from './routing';
/** Результат успешной аутификации */
export interface PayloadAuth {
  id: number
}
/** Действие аутификации */
export interface ActionAuth extends IAction {
  type: ActionType.AUTH
  payload: {
    auth: PayloadAuth
    location: PayloadLocation
  }
}
