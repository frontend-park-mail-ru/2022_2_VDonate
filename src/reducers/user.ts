import {ActionType} from '@configs/actionConfig';
import {IAction} from '@flux/types/actions';
import {Reducer} from '@flux/types/reducer';
import {State} from '@flux/types/store';

const userReducer: Reducer = (state: State, action: IAction): State => {
  switch (action.type) {
    case ActionType.LOGOUT:
      return {};
    case ActionType.LOGIN:
    case ActionType.SIGNUP:
      return action.payload;
    default:
      return state;
  }
};

export default userReducer;
