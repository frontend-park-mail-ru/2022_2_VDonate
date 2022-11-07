import {ActionType} from '@actions/types/action';
import {PayloadPost} from '@actions/types/posts';
import api from '@app/api';
import store from '@app/store';

export const getPosts = (authorID: number) => {
  api.getAllPosts(authorID)
      .then(
          (res) => {
            switch (res.status) {
              case 200:
                store.dispatch({
                  type: ActionType.GET_POSTS,
                  payload: res.body as PayloadPost[],
                });
                break;
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
