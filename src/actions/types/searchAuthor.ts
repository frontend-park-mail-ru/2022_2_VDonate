import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {PayloadUser} from './user';

export interface ActionSearch extends IAction {
    type: ActionType.SEARCH_AUTHORS
    payload: {
      authors: PayloadUser[]
    }
}
