import {ActionType} from '@actions/types/action';
import store from '@app/Store';

export const notice = (message: string | string[], type?: 'error' | 'info') => {
  store.dispatch({
    type: ActionType.NOTICE,
    payload: {
      message,
      type,
    },
  });
};
