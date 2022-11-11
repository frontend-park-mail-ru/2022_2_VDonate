import {ActionType} from '@actions/types/action';
import {PayloadPost} from '@actions/types/posts';
import api from '@app/api';
import store from '@app/store';

export interface PostResponse {
  img: string
  likesNum: number
  postID: 1
  text: string
  title: string
  userID: number
  isLiked: boolean
}

export interface PostForm extends HTMLCollection {
  title: HTMLInputElement
  text: HTMLTextAreaElement
  img?: HTMLInputElement
}

export const getPostsByAuthor = (author: PayloadPost['author']) => {
  api.getAuthorPosts(author.id)
      .then(
          (res) => {
            switch (res.status) {
              case 200: {
                const posts: PayloadPost[] = (res.body as PostResponse[]).map(
                    (postResponse) => {
                      const post: PayloadPost = {
                        author,
                        postID: postResponse.postID,
                        content: {
                          img: postResponse.img,
                          text: postResponse.text,
                          title: postResponse.title,
                        },
                        likesNum: postResponse.likesNum,
                        isLiked: false, // TODO получать из запроса
                        commentsNum: 0, // TODO получать из запроса
                        date: new Date(Date.now()), // TODO получать из запроса
                      };
                      return post;
                    },
                );
                store.dispatch({
                  type: ActionType.GET_POSTS,
                  payload: posts,
                });
                break;
              }
              default:
                store.dispatch({
                  type: ActionType.NOTICE,
                  payload: {
                    message:
                      `Запрос со статусом ${res.status} 
                      ошибкой ${(res.body as { message: string }).message}`,
                  },
                });
                break;
            }
          },
      )
      .catch(
          () => {
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: 'error fetch',
              },
            });
          },
      );
};

export const createPost = (form: PostForm) => {
  api.createPost({
    title: form.title.value,
    text: form.text.value,
    file: form.img?.files?.item(0) ?? undefined,
  })
      .then(
          () => {
            // TODO
          },
      )
      .catch(
          () => {
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: 'error fetch',
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
      .then(
          () => {
            // TODO
          },
      )
      .catch(
          () => {
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: 'error fetch',
              },
            });
          },
      );
};

export const likePost = (id: number) => {
  api.likePost(id)
      .then(
          () => {
            // TODO
          },
      )
      .catch(
          () => {
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: 'error fetch',
              },
            });
          },
      );
};

export const unlikePost = (id: number) => {
  api.unlikePost(id)
      .then(
          () => {
            // TODO
          },
      )
      .catch(
          () => {
            store.dispatch({
              type: ActionType.NOTICE,
              payload: {
                message: 'error fetch',
              },
            });
          },
      );
};
