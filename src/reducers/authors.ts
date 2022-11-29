import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const authorReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.SEARCH_AUTHORS:
        return action.payload.authors;
      default:
        return state;
    }
  };

export default authorReducer;
