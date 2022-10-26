import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {Map} from '@flux/types/store';

const userReducer: Reducer<Action> =
  (state: Map, action: Action): Map => {
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
