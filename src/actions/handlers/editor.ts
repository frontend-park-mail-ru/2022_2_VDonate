import {ActionType} from '@actions/types/action';
import {EditorType} from '@actions/types/editor';
import store from '@app/Store';
import {SubscriptionCardStatus}
  from '@components/SubscriptionCard/SubscriptionCard';

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

export const openPostEditor = (id: number) =>
  store.dispatch({
    type: ActionType.EDITOR_OPEN,
    payload: {
      type: EditorType.POST,
      id,
    },
  });

export const createNewPost = () =>
  store.dispatch({
    type: ActionType.EDITOR_OPEN,
    payload: {
      type: EditorType.POST,
      id: -1,
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

export const closeEditor = (id?: number) =>
  store.dispatch({
    type: ActionType.EDITOR_CLOSE,
    payload: id ? {
      type: EditorType.CLOSE_POST,
      id,
    } : {},
  });
