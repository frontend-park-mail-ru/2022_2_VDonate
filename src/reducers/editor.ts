import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const editorReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.EDITOR_OPEN:
      case ActionType.EDITOR_CLOSE:
        return action.payload;
      case ActionType.CHANGEUSERDATA_SUCCESS:
      case ActionType.UPDATE_POST:
      case ActionType.CREATE_POST:
        return {};
      default:
        return state;
    }
  };

export default editorReducer;
