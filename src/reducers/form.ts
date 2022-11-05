import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const formStatusReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.LOGIN_SUCCESS:
      case ActionType.SIGNUP_SUCCESS:
        return action.payload.formStatus;
      case ActionType.LOGIN_FAIL:
      case ActionType.SIGNUP_FAIL:
        return action.payload;
      default:
        return state;
    }
  };

export default formStatusReducer;
