import {SubscriptionCardStatus}
  from '@components/SubscriptionCard/SubscriptionCard';
import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export enum EditorType {
  PROFILE,
  SUBSCRIBTION,
  PAY,
  POST,
  CLOSE_POST,
}

interface PayloadProfileEditor {
  type: EditorType.PROFILE
}

interface PayloadSubscribtionEditor {
  type: EditorType.SUBSCRIBTION
  id?: number
}

interface PayloadPostEditor {
  type: EditorType.POST
  id: number
}
interface PayloadclosePostEditor {
  type: EditorType.CLOSE_POST
  id: number
}
interface PayloadPayEditor {
  type: EditorType.PAY
  authorID: number,
  authorSubscriptionID: number,
  currentCardStatus: SubscriptionCardStatus,
}

type PayloadOpenEditor =
  | PayloadProfileEditor
  | PayloadSubscribtionEditor
  | PayloadPayEditor
  | PayloadPostEditor;

type PayloadCloseEditor = Record<string, never>
  | PayloadclosePostEditor;

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
