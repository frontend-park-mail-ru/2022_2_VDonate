import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const postsReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.GET_POSTS:
        return action.payload;
      case ActionType.GETPROFILEDATA:
        return action.payload.posts ?? [];
      default:
        return state;
    }
  };

export default postsReducer;
