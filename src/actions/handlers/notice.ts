import {ActionType} from '@actions/types/action';
import store from '@app/store';

export default (message: string) => {
  store.dispatch({
    type: ActionType.NOTICE,
    payload: {
      message,
    },
  });
};
