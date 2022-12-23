import {Action, ActionType} from '@actions/types/action';
import {FormErrorType} from '@actions/types/formError';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const formErrorsReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.LOGIN_SUCCESS:
      case ActionType.SIGNUP_SUCCESS:
      case ActionType.CHANGE_USERDATA_SUCCESS:
      case ActionType.CREATE_AUTHOR_SUBSCRIPTION:
      case ActionType.EDIT_AUTHOR_SUBSCRIPTION:
        return action.payload.formErrors;
      case ActionType.LOGIN_FAIL:
      case ActionType.SIGNUP_FAIL:
      case ActionType.CHANGE_USERDATA_FAIL:
        return action.payload;
      case ActionType.WITHDRAW_ERROR:
        if (JSON.stringify(state) == JSON.stringify(action.payload)) {
          return {
            type: FormErrorType.WITHDRAW,
            message: 'Все еще некорректная длина',
          };
        }
        return action.payload;
      case ActionType.ROUTING:
        return {};
      default:
        return state;
    }
  };

export default formErrorsReducer;
