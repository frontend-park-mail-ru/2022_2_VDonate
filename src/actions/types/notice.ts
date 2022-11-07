import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export interface PayloadNotice {
  message: string
}

export interface ActionNotice extends IAction {
  type: ActionType.NOTICE
  payload: PayloadNotice
}
