import {ActionType} from '@actions/types/action';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import {PayloadNotice} from '@actions/types/notice';
import {PayloadPost} from '@actions/types/posts';
import {PayloadUser} from '@actions/types/user';
import api from '@app/Api';
import store from '@app/Store';

export const createPost = (content: string, tier: number) => {
  const tierIdx = (store.getState().profile as PayloadGetProfileData)
      .authorSubscriptions?.map((sub) => {
        return sub.tier;
      }).findIndex((subTier) => subTier === tier);

  if (
    // Если тир указан
    tier !== 0 &&
    (
      // И не существует
      !tierIdx ||
      // Или не найден в подписках
      tierIdx === -1
    )) {
    store.dispatch({
      type: ActionType.NOTICE,
      payload: {
        message: 'Вы указали несуществующий уровень подписки',
      },
    });
    return;
  }

  api.createPost({
    tier,
    content: content,
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
              contentTemplate: res.body.contentTemplate as string,
              dateCreated: new Date(Date.now()),
              isAllowed: true,
              isLiked: false,
              likesNum: 0,
              postID: res.body.postID as number,
              // tags
              tier: 0,
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
            message: err as Error,
          },
        });
      },
      );
};

export const updatePost = (id: number, content: string, tier: number) => {
  const tierIdx = (store.getState().profile as PayloadGetProfileData)
      .authorSubscriptions?.map((sub) => {
        return sub.tier;
      }).findIndex((subTier) => subTier === tier);

  if (
    // Если тир указан
    tier !== 0 &&
    (
      // И не существует
      !tierIdx ||
      // Или не найден в подписках
      tierIdx === -1
    )) {
    store.dispatch({
      type: ActionType.NOTICE,
      payload: {
        message: 'Вы указали несуществующий уровень подписки',
      },
    });
    return;
  }

  api.updatePost(id, {
    tier: tier,
    content: content,
  })
      .then((res) => {
        if (res.ok) {
          store.dispatch({
            type: ActionType.UPDATE_POST,
            payload: {
              postID: id,
              content: res.body.content as string,
              contentTemplate: res.body.contentTemplate as string,
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
