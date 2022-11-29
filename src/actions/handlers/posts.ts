import {ActionType} from '@actions/types/action';
import {PayloadNotice} from '@actions/types/notice';
import {PayloadPost} from '@actions/types/posts';
import {PayloadUser} from '@actions/types/user';
import api from '@app/api';
import store from '@app/store';

export interface PostForm extends HTMLCollection {
  // title: HTMLInputElement
  text: HTMLTextAreaElement
  // img?: HTMLInputElement
}

// interface PostCreateResponse {
//   imgPath: string
//   postID: number
// }

// export interface PostResponse {
//   author: {
//     id: number
//     username: string
//     imgPath: string
//   }
//   img: string
//   likesNum: number
//   postID: 1
//   text: string
//   title: string
//   userID: number
//   isLiked: boolean
// }

export const createPost = (author: PayloadPost['author'], form: PostForm) => {
  api.createPost({
    content: form.text.value,
  })
      .then((res) => {
        if (res.ok) {
          const user = store.getState().user as PayloadUser;
          store.dispatch({
            type: ActionType.CREATE_POST,
            payload: {
              author: {
                userID: user.id,
                imgPath: user.avatar,
                username: user.username,
              },
              content: res.body.contentTemplate as string,
              dateCreated: new Date(Date.now()),
              isAllowed: true,
              isLiked: false,
              likesNum: 0,
              postID: res.body.postID as number,
              // tags
              tier: 0,
              userID: user.id,
              commentsNum: 0,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: res.body as PayloadNotice,
          });
        }
      },
      )
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
      },
      );
};

export const updatePost = (id: number, form: PostForm) => {
  api.updatePost(id, {
    content: form.text.value,
  })
      .then((res) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.UPDATE_POST,
            payload: {
              postID: id,
              content: form.text.value,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: res.body as PayloadNotice,
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
      },
      );
};

export const deletePost = (postID: number) => {
  api.deletePost(postID)
      .then((res) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.DELETE_POST,
            payload: {
              postID,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: res.body as PayloadNotice,
          });
        }
      },
      )
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
      },
      );
};

export const likePost = (id: number) => {
  api.likePost(id)
      .then((res) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.UPDATE_POST,
            payload: {
              postID: id,
              isLiked: true,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: res.body as PayloadNotice,
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
      },
      );
};

export const unlikePost = (id: number) => {
  api.unlikePost(id)
      .then((res) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.UPDATE_POST,
            payload: {
              postID: id,
              isLiked: false,
            },
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: res.body as PayloadNotice,
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
      },
      );
};

export const getFeed = () => {
  api.getFeed()
      .then((res) => {
        if (res.ok) {
          // const posts = (res.body as PostResponse[]).map(
          //     (postResponse) => {
          //       const post: PayloadPost = {
          //         author: postResponse.author,
          //         postID: postResponse.postID,
          //         content: {
          //           img: postResponse.img,
          //           text: postResponse.text,
          //           title: postResponse.title,
          //         },
          //         likesNum: postResponse.likesNum,
          //         isLiked: postResponse.isLiked,
          //         commentsNum: 0, // TODO получать из запроса
          //         date: new Date(Date.now()), // TODO получать из запроса
          //       };
          //       return post;
          //     },
          // );
          store.dispatch({
            type: ActionType.GET_POSTS,
            payload: res.body as PayloadPost[],
          });
        } else {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: res.body as PayloadNotice,
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as string,
          },
        });
      },
      );
};
