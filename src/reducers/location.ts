import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const locationReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.AUTH:
      case ActionType.LOGIN:
        return action.payload.location;
      case ActionType.ROUTING:
        return action.payload;
      default:
        return state;
    }
  };

export default locationReducer;
