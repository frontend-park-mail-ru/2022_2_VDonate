import {ActionType} from '@actions/types/action';
import {PayloadBackNotice} from '@actions/types/backNotice';
import store from '@app/Store';
import WebSocketNotice from '@app/WebSocketNotice';

export const addBackNotice =
  (data: string) => {
    const notices = JSON.parse(data) as PayloadBackNotice[];

    store.dispatch({
      type: ActionType.ADD_BACK_NOTICE,
      payload: notices,
    });
  };


export const clearAllBackNotice = () => {
  WebSocketNotice.clearAll();
  store.dispatch({
    type: ActionType.CLEAR_BACK_NOTICE,
    payload: {},
  });
};
