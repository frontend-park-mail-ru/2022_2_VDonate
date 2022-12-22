import {SubscriptionCardStatus}
  from '@components/SubscriptionCard/SubscriptionCard';
import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export enum EditorType {
  PROFILE,
  SUBSCRIPTION,
  PAY,
  POST,
  WITHDRAW,
  CLOSE_POST,
}

interface PayloadProfileEditor {
  type: EditorType.PROFILE
}

interface PayloadSubscriptionEditor {
  type: EditorType.SUBSCRIPTION
  id?: number
}

interface PayloadPostEditor {
  type: EditorType.POST
  id: number
}
interface PayloadClosePostEditor {
  type: EditorType.CLOSE_POST
  id: number
}
interface PayloadPayEditor {
  type: EditorType.PAY
  authorID: number,
  authorSubscriptionID: number,
  currentCardStatus: SubscriptionCardStatus,
}

interface PayloadWithdrawEditor {
  type: EditorType.WITHDRAW
}

type PayloadOpenEditor =
  | PayloadProfileEditor
  | PayloadSubscriptionEditor
  | PayloadPayEditor
  | PayloadPostEditor
  | PayloadWithdrawEditor;

type PayloadCloseEditor = Record<string, never>
  | PayloadClosePostEditor;

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
