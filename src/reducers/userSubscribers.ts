import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const UserSubscribersReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.GETSUBSCRIPTIONS:
        return action.payload.subscriptions;
      default:
        return state;
    }
  };

export default UserSubscribersReducer;
