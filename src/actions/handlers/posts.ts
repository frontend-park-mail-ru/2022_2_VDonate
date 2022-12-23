import {ActionType} from '@actions/types/action';
import {PayloadNotice} from '@actions/types/notice';
import {PayloadPost} from '@actions/types/posts';
import {PayloadUser} from '@actions/types/user';
import api from '@app/Api';
import store from '@app/Store';
import {deleteSpacebarsAndEnters, postValidation} from '@validation/validation';

export const createPost = (content: string, tier: number) => {
  content = deleteSpacebarsAndEnters(content);
  const err = postValidation(content);
  if (err) {
    store.dispatch({
      type: ActionType.NOTICE,
      payload: {
        message: err,
      },
    });
    return;
  }
  if (tier < 0 || tier > 10000) {
    store.dispatch({
      type: ActionType.NOTICE,
      payload: {
        message: 'Уровень должен быть в пределах от 0 до 10000',
      },
    });
    return;
  }
  api.createPost({
    tier,
    content,
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
              content: res.body.content as string,
              dateCreated: res.body.dateCreated as string,
              isAllowed: true,
              isLiked: false,
              likesNum: 0,
              postID: res.body.postID as number,
              // tags
              tier: tier,
              commentsNum: 0,
            },
          });
        } else {
          let msg: PayloadNotice = {
            message: '',
          };
          switch (res.status) {
            case 400:
              msg.message = 'Ошибка при создании запроса на сервер';
              break;
            case 401:
              msg.message = 'Ошибка авторизации';
              break;
            case 403:
              msg.message = 'Ошибка доступа';
              break;
            case 404:
            case 500:
              msg.message = 'Ошибка сервера при создании поста';
              break;
            default:
              msg = res.body as PayloadNotice;
              break;
          }
          store.dispatch({
            type: ActionType.NOTICE,
            payload: msg,
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
      },
      );
};

export const updatePost =
  (id: number, content: string, tier: number) => {
    content = deleteSpacebarsAndEnters(content);
    const err = postValidation(content);
    if (err) {
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: err,
        },
      });
      return;
    }
    if (tier < 0 || tier > 10000) {
      store.dispatch({
        type: ActionType.NOTICE,
        payload: {
          message: 'Уровень должен быть в пределах от 0 до 10000',
        },
      });
      return;
    }
    api.updatePost(id, {
      tier,
      content,
    })
        .then((res) => {
          if (res.ok) {
            store.dispatch({
              type: ActionType.UPDATE_POST,
              payload: {
                postID: id,
                content: res.body.content as string,
              },
            });
          } else {
            let msg: PayloadNotice = {
              message: '',
            };
            switch (res.status) {
              case 400:
                msg.message = 'Ошибка при создании запроса на сервер';
                break;
              case 401:
                msg.message = 'Ошибка авторизации';
                break;
              case 403:
                msg.message = 'Ошибка доступа';
                break;
              case 404:
                msg.message = 'Ошибка сервера\n Пост не найден';
                break;
              case 500:
                msg.message = 'Ошибка сервера при изменении поста';
                break;
              default:
                msg = res.body as PayloadNotice;
                break;
            }
            store.dispatch({
              type: ActionType.NOTICE,
              payload: msg,
            });
          }
        })
        .catch((err) => {
          store.dispatch({
            type: ActionType.NOTICE,
            payload: {
              message: err as Error,
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
          let msg: PayloadNotice = {
            message: '',
          };
          switch (res.status) {
            case 400:
              msg.message = 'Ошибка при создании запроса на сервер';
              break;
            case 401:
              msg.message = 'Ошибка авторизации';
              break;
            case 403:
              msg.message = 'Ошибка доступа';
              break;
            case 404:
              msg.message = 'Ошибка сервера\n Пост не найден';
              break;
            case 500:
              msg.message = 'Ошибка сервера при удалении поста';
              break;
            default:
              msg = res.body as PayloadNotice;
              break;
          }
          store.dispatch({
            type: ActionType.NOTICE,
            payload: msg,
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
          let msg: PayloadNotice = {
            message: '',
          };
          switch (res.status) {
            case 400:
              msg.message = 'Ошибка при создании запроса на сервер';
              break;
            case 401:
              msg.message = 'Ошибка авторизации';
              break;
            case 404:
              msg.message = 'Ошибка сервера\n Пост не найден';
              break;
            case 500:
              msg.message = 'Ошибка сервера при лайке поста';
              break;
            default:
              msg = res.body as PayloadNotice;
              break;
          }
          store.dispatch({
            type: ActionType.NOTICE,
            payload: msg,
          });
        }
      })
      .catch((err) => {
        store.dispatch({
          type: ActionType.NOTICE,
          payload: {
            message: err as Error,
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
            message: err as Error,
          },
        });
      },
      );
};

export const getFeed = () => {
  api.getFeed()
      .then((res) => {
        if (res.ok) {
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
            message: err as Error,
          },
        });
      },
      );
};

export const putImage = (postID: number, file: File) => {
  api.putImage(file)
      .then((res) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.PUT_IMAGE,
            payload: {
              postID,
              url: res.body.url as string,
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
            message: err as Error,
          },
        });
      });
};
