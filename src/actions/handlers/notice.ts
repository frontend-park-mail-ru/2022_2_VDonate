import {ActionType} from '@actions/types/action';
import store from '@app/Store';

export default (message: string) => {
  store.dispatch({
    type: ActionType.NOTICE,
    payload: {
      message,
    },
  });
};
