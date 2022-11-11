import {Action, ActionType} from '@actions/types/action';
import {PayloadPost} from '@actions/types/posts';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const postsReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.GET_POSTS:
        return action.payload;
      case ActionType.GETPROFILEDATA:
        return action.payload.posts ?? [];
      case ActionType.UPDATE_POST: {
        const post = (state as PayloadPost[]).find(
            (post) => post.postID === action.payload.postID,
        );
        if (post) {
          if (action.payload.isLiked !== undefined) {
            post.isLiked = action.payload.isLiked;
            post.likesNum += action.payload.isLiked ? 1 : -1;
          }
          if (action.payload.content) {
            post.content = action.payload.content;
          }
        }
        return state;
      }
      default:
        return state;
    }
  };

export default postsReducer;
