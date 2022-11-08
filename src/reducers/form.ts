import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const formErrorsReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.LOGIN_SUCCESS:
      case ActionType.SIGNUP_SUCCESS:
      case ActionType.CHANGEUSERDATA_SUCCESS:
        return action.payload.formErrors;
      case ActionType.LOGIN_FAIL:
      case ActionType.SIGNUP_FAIL:
      case ActionType.CHANGEUSERDATA_FAIL:
        return action.payload;
      case ActionType.ROUTING:
        return {};
      default:
        return state;
    }
  };

export default formErrorsReducer;
