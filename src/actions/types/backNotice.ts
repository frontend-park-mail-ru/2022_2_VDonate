import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

interface LikeBackNoticeModel {
  name: 'like'
  data: {
    username: number
  }
  time: string
}

interface PostBackNoticeModel {
  name: 'posts'
  data: {
    author_id: number
    author_name: number
  }
  time: string
}

interface SubscriberBackNoticeModel {
  name: 'subscriber'
  data: {
    subscriber_id: number
    subscriberName: string
  }
  time: string
}

export enum PaymentStatus {
  SUCCESS = 'PAID',
  FAIL = 'REJECTED',
  TIMEOUT = 'EXPIRED',
}

interface PaymentBackNoticeModel {
  name: 'payment'
  data: {
    author_id: number
    sub_id: number
    status: PaymentStatus
  }
  time: string
}

export type PayloadBackNotice =
  | LikeBackNoticeModel
  | PostBackNoticeModel
  | SubscriberBackNoticeModel
  | PaymentBackNoticeModel;

export interface ActionAddBackNotice extends IAction {
  type: ActionType.ADD_BACK_NOTICE
  payload: PayloadBackNotice[]
}

export interface ActionClearBackNotice extends IAction {
  type: ActionType.CLEAR_BACK_NOTICE
  payload: Record<string, never>
}
