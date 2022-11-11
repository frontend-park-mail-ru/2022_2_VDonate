import {ActionType} from '@actions/types/action';
import {PayloadNotice} from '@actions/types/notice';
import {PayloadPost} from '@actions/types/posts';
import api from '@app/api';
import store from '@app/store';

export interface PostForm extends HTMLCollection {
  title: HTMLInputElement
  text: HTMLTextAreaElement
  img?: HTMLInputElement
}

interface PostCreateResponse {
  imgPath: string
  postID: number
}

export const createPost = (author: PayloadPost['author'], form: PostForm) => {
  api.createPost({
    title: form.title.value,
    text: form.text.value,
    file: form.img?.files?.item(0) ?? undefined,
  })
      .then((res) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.CREATE_POST,
            payload: {
              author,
              postID: (res.body as PostCreateResponse).postID,
              commentsNum: 0,
              date: new Date(Date.now()),
              content: {
                img: (res.body as PostCreateResponse).imgPath,
                text: form.text.value,
                title: form.title.value,
              },
              isLiked: false,
              likesNum: 0,
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
    title: form.title.value,
    text: form.text.value,
    file: form.img?.files?.item(0) ?? undefined,
  })
      .then((res) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.UPDATE_POST,
            payload: {
              postID: id,
              content: {
                title: form.title.value,
                text: form.text.value,
                img: (res.body as {imgPath: string}).imgPath,
              },
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
