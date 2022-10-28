import store from '@app/store';
import {Pages} from '@configs/router';
import {IAction} from '@flux/types/actions';
import {PropTree} from '@flux/types/store';
import {ActionType} from './action';

export interface StateLocation {
  type: Pages
  options?: PropTree
}

export interface ActionRouting extends IAction {
  type: ActionType.ROUTING
  payload: StateLocation
}

export const dispatch = (action: ActionRouting) => {
  store.dispatch(action);
};
