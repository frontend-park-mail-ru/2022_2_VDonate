import {ActionType} from '@actions/types/action';
import {EditorType} from '@actions/types/editor';
import store from '@app/store';

export const openPostEditor = (id: number) =>
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

export const openSubscribtionEditor = (id: number) =>
  store.dispatch({
    type: ActionType.EDITOR_OPEN,
    payload: {
      type: EditorType.SUBSCRIBTION,
      id,
    },
  });

export const closeEditor = () =>
  store.dispatch({
    type: ActionType.EDITOR_CLOSE,
    payload: {},
  });
