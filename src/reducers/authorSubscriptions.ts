import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const authorSubscriptionsReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.CREATEAUTHORSUBSRIPTION:
      case ActionType.EDITAUTHORSUBSRIPTION:
        return action.payload;
      default:
        return state;
    }
  };

export default authorSubscriptionsReducer;
