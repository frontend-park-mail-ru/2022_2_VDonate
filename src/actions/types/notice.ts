import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

interface PayloadNotice {
  message: string
}

export interface ActionNotice extends IAction {
  type: ActionType.NOTICE
  payload: PayloadNotice
}
