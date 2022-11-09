import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export interface PayloadPostEditor {
  id: number | null
}

export interface ActionPostEditor extends IAction {
  type: ActionType.POST_EDITOR
  payload: PayloadPostEditor
}
