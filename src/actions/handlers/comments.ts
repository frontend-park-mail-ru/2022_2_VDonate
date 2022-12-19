import {ActionType} from '@actions/types/action';
import store from '@app/Store';
import api from '@app/Api';
export const getComments = (postID: number): void => {
  api.getComments(postID)
      .then((res) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.GET_COMMENTS,
            payload: {
              postID,
              comments: [],
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
  store.dispatch({
    type: ActionType.ADD_COMMENT,
    payload: {
      postID,
      comment: {
        id: 1,
        authorId: 1,
        userId: 5,
        userImg: '',
        userUsername: 'username',
        text,
      },
    },
  });
};

export const updateComment =
  (postID: number, commentID: number, text: string): void => {
    store.dispatch({
      type: ActionType.UPDATE_COMMENT,
      payload: {
        postID,
        comment: {
          id: commentID,
          authorId: 1,
          userId: 5,
          userImg: '',
          userUsername: 'username',
          text,
        },
      },
    });
  };

export const deleteComment = (postID: number, commentID: number): void => {
  store.dispatch({
    type: ActionType.DELETE_COMMENT,
    payload: {
      postID,
      commentID,
    },
  });
};

export const closeComments = (postID: number): void => {
  store.dispatch({
    type: ActionType.CLOSE_COMMENTS,
    payload: {
      postID,
    },
  });
};
