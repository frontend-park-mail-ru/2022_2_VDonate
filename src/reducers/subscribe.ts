import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const SubscribeReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.SUBSCRIBE:
      case ActionType.UNSUBSCRIBE:
      case ActionType.GETSUBSCRIPTIONS:
        return action.payload;
      default:
        return state;
    }
  };

export default SubscribeReducer;
