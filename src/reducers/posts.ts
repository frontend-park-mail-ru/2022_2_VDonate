import {Action, ActionType} from '@actions/types/action';
import {PayloadPost} from '@actions/types/posts';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const createPostsMap = (posts: PayloadPost[]): Map<number, PayloadPost> => {
  const postsMap = new Map<number, PayloadPost>();
  posts.forEach((post) => postsMap.set(post.postID, post));
  return postsMap;
};

const postsReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.GET_POSTS:
        return createPostsMap(action.payload);
      case ActionType.GETPROFILEDATA:
        return createPostsMap(action.payload.posts ?? []);
      case ActionType.UPDATE_POST: {
        const post = (state as Map<number, PayloadPost>)
            .get(action.payload.postID);
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
      case ActionType.CREATE_POST:
        (state as Map<number, PayloadPost>)
            .set(action.payload.postID, action.payload);
        return state;
      case ActionType.DELETE_POST:
        (state as Map<number, PayloadPost>).delete(action.payload.postID);
        return state;
      case ActionType.SUBSCRIBE:
      case ActionType.UNSUBSCRIBE:
        return createPostsMap(action.payload.posts ?? []);
      default:
        return state;
    }
  };

export default postsReducer;
