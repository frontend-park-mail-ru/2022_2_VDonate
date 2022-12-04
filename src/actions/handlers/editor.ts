import {ActionType} from '@actions/types/action';
import {EditorType} from '@actions/types/editor';
import store from '@app/Store';
import {SubscriptionCardStatus}
  from '@components/SubscriptionCard/SubscriptionCard';

export const openPostEditor = (id?: number) =>
  store.dispatch({
    type: ActionType.EDITOR_OPEN,
    payload: {
      type: EditorType.POST,
      id,
    },
  });

export const openProfileEditor = () =>
  store.dispatch({
    type: ActionType.EDITOR_OPEN,
    payload: {
      type: EditorType.PROFILE,
    },
  });

export const openSubscribtionEditor = (id?: number) =>
  store.dispatch({
    type: ActionType.EDITOR_OPEN,
    payload: {
      type: EditorType.SUBSCRIBTION,
      id,
    },
  });

export const openPayEditor = (
    authorID: number,
    authorSubscriptionID: number,
    currentCardStatus: SubscriptionCardStatus) => {
  store.dispatch({
    type: ActionType.EDITOR_OPEN,
    payload: {
      type: EditorType.PAY,
      authorID,
      authorSubscriptionID,
      currentCardStatus,
    },
  });
};

export const closeEditor = () =>
  store.dispatch({
    type: ActionType.EDITOR_CLOSE,
    payload: {},
  });
