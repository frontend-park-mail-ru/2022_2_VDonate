import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {State} from '@flux/types/store';

const userReducer: Reducer<Action> =
  (state: State, action: Action): State => {
    switch (action.type) {
      case ActionType.AUTH:
        return action.payload;
      case ActionType.LOGIN:
        return action.payload;
      default:
        return state;
    }
  };

export default userReducer;
