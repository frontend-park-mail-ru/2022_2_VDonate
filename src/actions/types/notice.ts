import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export interface PayloadNotice {
  timestamp?: number // Это поле указывается только при сохранении в хранилище
  message: string[] | string | Error | null
  type?: 'error' | 'info'
}

export interface ActionNotice extends IAction {
  type: ActionType.NOTICE
  payload: PayloadNotice
}
