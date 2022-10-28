import store from '@app/store';
import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {ActionNotice} from './notice';

interface PayloadAuth {
  id: number
}

export interface ActionAuth extends IAction {
  type: ActionType.AUTH
  payload: PayloadAuth
}

export const dispatch = (action: ActionAuth | ActionNotice) => {
  store.dispatch(action);
};
