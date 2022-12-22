import {Action, ActionType} from '@actions/types/action';
import {EditorType} from '@actions/types/editor';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const editorReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.EDITOR_OPEN:
      case ActionType.EDITOR_CLOSE:
        return action.payload;
      case ActionType.UPDATE_POST:
      case ActionType.CREATE_POST:
        return {
          type: EditorType.CLOSE_POST,
          id: action.payload.postID,
        };
      case ActionType.DELETE_POST:
      case ActionType.CHANGE_USERDATA_SUCCESS:
      case ActionType.DELETE_AUTHOR_SUBSCRIPTION:
      case ActionType.SUBSCRIBE:
      case ActionType.UNSUBSCRIBE:
      case ActionType.SWITCH_SUBSCRIPTION:
      case ActionType.WITHDRAW:
        return {};
      case ActionType.CREATE_AUTHOR_SUBSCRIPTION:
      case ActionType.EDIT_AUTHOR_SUBSCRIPTION: {
        let errorFounded = false;
        Object.entries(action.payload.formErrors).forEach(
            ([, value]) => {
              if (typeof value === 'string') {
                errorFounded = true;
              }
            },
        );
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return errorFounded ? state : {};
      }
      case ActionType.ROUTING:
        return {};
      default:
        return state;
    }
  };

export default editorReducer;
