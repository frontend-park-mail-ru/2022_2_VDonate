import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export interface PayloadSubscribe {
  success: boolean
  error: string | undefined
}

export interface Subscription {
  author: {
    id?: number
    avatar: string
    username: string
  }
  id?: number
  img: string
  price: number
  text: string
  tier: number
  title: string
}

export interface PayloadGetSubscriptions {
  subscriptions: Subscription[]
  error: string | undefined
}

export interface PayloadAuthorSubscription {
  imgPath?: string
  subscriptionId?: number
  message?: string
}


export interface ActionSubscribe extends IAction {
  type: ActionType.SUBSCRIBE
  payload: PayloadSubscribe
}

export interface ActionUnsubscribe extends IAction {
  type: ActionType.UNSUBSCRIBE
  payload: PayloadSubscribe
}

export interface ActionGetSubscriptions extends IAction {
  type: ActionType.GETSUBSCRIPTIONS
  payload: PayloadGetSubscriptions
}

export interface ActionEditAuthorSubscription extends IAction {
  type: ActionType.EDITAUTHORSUBSRIPTION
  payload: PayloadAuthorSubscription
}

export interface ActionCreateAuthorSubscription extends IAction {
  type: ActionType.CREATEAUTHORSUBSRIPTION
  payload: PayloadAuthorSubscription
}
