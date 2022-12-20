import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export interface PayloadNotice {
  timestamp?: number // Это поле указывается только при сохранении в хранилище
  message: string[] | string | Error | null
  type?: 'error' | 'info'
}

export interface PayloadBackNotice {
  timestamp: Date
  message: string
  type?: 'error' | 'info'
}

export interface ActionNotice extends IAction {
  type: ActionType.NOTICE
  payload: PayloadNotice
}

export interface ActionAddBackNotice extends IAction {
  type: ActionType.ADD_BACK_NOTICE
  payload: PayloadBackNotice[]
}

export interface ActionClearBackNotice extends IAction {
  type: ActionType.CLEAR_BACK_NOTICE
  payload: Record<string, never>
}
