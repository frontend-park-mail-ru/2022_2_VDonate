import {Action, ActionType} from '@actions/types/action';
import {PayloadBackNotice} from '@actions/types/backNotice';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const backNoticeReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.ADD_BACK_NOTICE:
        (state as PayloadBackNotice[]).push(...action.payload);
        return state;
      case ActionType.CLEAR_BACK_NOTICE:
        return [];
      default:
        return state;
    }
  };

export default backNoticeReducer;
