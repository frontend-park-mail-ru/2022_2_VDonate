import {Action, ActionType} from '@actions/types/action';
import {PayloadComment} from '@actions/types/comments';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const commentsReducer: Reducer<Action> =
(state: PropTree, action: Action): PropTree => {
  switch (action.type) {
    case ActionType.GET_COMMENTS: {
      const commentMap = new Map<number, PayloadComment>();
      action.payload.comments.forEach((comment) => {
        commentMap.set(comment.id, comment);
      });
      return {
        postID: action.payload.postID,
        commentMap,
      };
    }
    case ActionType.ADD_COMMENT:
      return {
        postID: action.payload.postID,
        comment: action.payload.comment,
      };
    case ActionType.UPDATE_COMMENT:
      return {
        postID: action.payload.postID,
        commentID: action.payload.comment.id,
        comment: action.payload.comment,
      };
    case ActionType.DELETE_COMMENT:
      return {
        postID: action.payload.postID,
        commentID: action.payload.commentID,
      };
    case ActionType.CLOSE_COMMENTS:
      return {
        postID: action.payload.postID,
      };
    default:
      return {};
  }
};

export default commentsReducer;
