import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

interface PayloasdNotice {
  message: string
}

export interface ActionNotice extends IAction {
  type: ActionType.NOTICE
  payload: PayloasdNotice
}
