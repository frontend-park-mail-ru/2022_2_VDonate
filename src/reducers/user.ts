import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const userReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.AUTH:
        return action.payload.auth;
      case ActionType.LOGIN:
        return action.payload.login;
      default:
        return state;
    }
  };

export default userReducer;
