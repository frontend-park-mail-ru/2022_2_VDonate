import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const noticeReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.NOTICE:
        return {
          timestamp: performance.now(),
          ...action.payload,
        };
      case ActionType.LOGIN_FAIL:
      case ActionType.SIGNUP_FAIL:
      case ActionType.CHANGEUSERDATA_FAIL:
      {
        const msgArr = Array<string>();
        Object.entries(action.payload).forEach(
            ([, value]) => {
              if (typeof value === 'string') {
                msgArr.push(value);
              }
            },
        );
        return {
          timestamp: performance.now(),
          message: msgArr,
        };
      }
      case ActionType.EDITAUTHORSUBSRIPTION:
      case ActionType.CREATEAUTHORSUBSRIPTION:
      {
        const msgArr = Array<string>();
        Object.entries(action.payload.formErrors).forEach(
            ([, value]) => {
              if (typeof value === 'string') {
                msgArr.push(value);
              }
            },
        );
        return {
          timestamp: performance.now(),
          message: msgArr,
        };
      }
      default:
        return {
          timestamp: -1,
          message: '',
        };
    }
  };

export default noticeReducer;
