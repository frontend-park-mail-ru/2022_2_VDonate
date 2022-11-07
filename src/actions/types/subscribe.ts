import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

interface PayloadSubscribe {
  success: boolean
  error: string | undefined
}

export interface ActionSubscribe extends IAction {
  type: ActionType.SUBSCRIBE
  payload: PayloadSubscribe
}
