import {Pages} from '@configs/router';
import {IAction} from '@flux/types/actions';
import {PropTree} from '@flux/types/store';
import {ActionType} from './action';

export interface PayloadLocation {
  type: Pages
  options?: PropTree
}

export interface ActionRouting extends IAction {
  type: ActionType.ROUTING
  payload: PayloadLocation
}
