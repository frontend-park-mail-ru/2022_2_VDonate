import {ActionType} from 'src/configs/actionConfig';
import {IAction} from 'src/modules/flux/types/actions';
import {Reducer} from 'src/modules/flux/types/reducer';
import {State} from 'src/modules/flux/types/store';

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
