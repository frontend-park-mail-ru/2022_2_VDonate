import {ActionType} from '@actions/types/action';
import store from '@app/Store';
import api from '@app/Api';
import {PayloadComment} from '@actions/types/comments';
export const getComments = (postID: number): void => {
  api.getComments(postID)
      .then((res) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.GET_COMMENTS,
            payload: {
              postID,
              comments: res.body as PayloadComment[],
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: res.body.message as string,
            },
          });
        }
      },
      )
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
        return;
      },
      );
};

export const addComment = (postID: number, text: string): void => {
  api.addComment(postID, text)
      .then((res) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.ADD_COMMENT,
            payload: {
              postID,
              comment: res.body as PayloadComment,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: res.body.message as string,
            },
          });
        }
      },
      )
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
        return;
      },
      );
};

export const updateComment =
  (postID: number, commentID: number, text: string): void => {
    api.updateComment(commentID, text)
        .then((res) => {
          if (res.ok) {
            store.dispatch({
              type: ActionType.UPDATE_COMMENT,
              payload: {
                postID,
                comment: res.body as PayloadComment,
              },
            });
          } else {
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: res.body.message as string,
              },
            });
          }
        },
        )
        .catch((err) => {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: err as Error,
            },
          });
          return;
        },
        );
  };

export const deleteComment = (postID: number, commentID: number): void => {
  api.deleteComment(commentID)
      .then((res) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.DELETE_COMMENT,
            payload: {
              postID,
              commentID,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: res.body.message as string,
            },
          });
        }
      },
      )
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
          },
        });
        return;
      },
      );
};

export const closeComments = (postID: number): void => {
  store.dispatch({
    type: ActionType.CLOSE_COMMENTS,
    payload: {
      postID,
    },
  });
};
