import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const userReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.AUTH:
      case ActionType.LOGIN_SUCCESS:
      case ActionType.SIGNUP_SUCCESS:
        return action.payload.user;
      default:
        return state;
    }
  };

export default userReducer;
