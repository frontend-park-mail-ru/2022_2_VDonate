import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const noticeReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.NOTICE:
        action.payload.timestamp = performance.now();
        return action.payload;
      case ActionType.WITHDRAW:
        return {
          timestamp: performance.now(),
          message: `Вывод средств произведен успешно`,
          type: 'info',
        };
      case ActionType.LOGIN_FAIL:
      case ActionType.SIGNUP_FAIL:
      case ActionType.CHANGE_USERDATA_FAIL:
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
      case ActionType.EDIT_AUTHOR_SUBSCRIPTION:
      case ActionType.CREATE_AUTHOR_SUBSCRIPTION:
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
      case ActionType.CLEAR_BACK_NOTICE:
        return {
          timestamp: performance.now(),
          message: 'Уведомления очищены.',
          type: 'info',
        };
      case ActionType.CHANGE_USERDATA_SUCCESS:
      case ActionType.LOGIN_SUCCESS:
      case ActionType.SIGNUP_SUCCESS:
      case ActionType.LOGOUT_SUCCESS:
        return {
          timestamp: -1,
          message: '',
        };
      default:
        return state;
    }
  };

export default noticeReducer;
