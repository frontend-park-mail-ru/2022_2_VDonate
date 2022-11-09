import {ActionType} from '@actions/types/action';
import store from '@app/store';

export const postEditor = (id: number | null) => {
  store.dispatch({
    type: ActionType.POST_EDITOR,
    payload: {
      id,
    },
  });
};
