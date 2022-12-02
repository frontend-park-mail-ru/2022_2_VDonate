import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export enum EditorType {
  POST,
  PROFILE,
  SUBSCRIBTION,
}

interface PayloadPostEditor {
  type: EditorType.POST
  id?: number
}

interface PayloadProfileEditor {
  type: EditorType.PROFILE
}

interface PayloadSubscribtionEditor {
  type: EditorType.SUBSCRIBTION
  id?: number
}

type PayloadOpenEditor =
  | PayloadPostEditor
  | PayloadProfileEditor
  | PayloadSubscribtionEditor;

type PayloadCloseEditor = Record<string, never>;

export type PayloadEditor =
  | PayloadCloseEditor
  | PayloadOpenEditor;

export interface ActionEditorOpen extends IAction {
  type: ActionType.EDITOR_OPEN
  payload: PayloadOpenEditor
}

export interface ActionEditorClose extends IAction {
  type: ActionType.EDITOR_CLOSE
  payload: PayloadCloseEditor
}
