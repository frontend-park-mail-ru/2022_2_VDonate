import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {FormErrorType} from './formError';

export interface PayloadSubscribe {
  authorSubscriptionID?: number
  error: string | undefined
}

export interface Subscription {
  authorAvatar?: string
  authorID: number
  authorName?: string
  id: number
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

export interface PayloadAuthorSubscriptionErrors {
  type: FormErrorType.AUTHOR_SUBSCRIPTION
  price: null | string
  text: null | string
  tier: null | string
  title: null | string
  file: null | string
}

export interface ActionEditAuthorSubscription extends IAction {
  type: ActionType.EDITAUTHORSUBSRIPTION
  payload: {
    subscription?: Subscription
    formErrors: PayloadAuthorSubscriptionErrors
  }
}

export interface ActionCreateAuthorSubscription extends IAction {
  type: ActionType.CREATEAUTHORSUBSRIPTION
  payload: {
    subscription?: Subscription
    formErrors: PayloadAuthorSubscriptionErrors
  }
}

export interface ActionDeleteAuthorSubscription extends IAction {
  type: ActionType.DELETEAUTHORSUBSCRIPTION
  payload: {
    id: number,
  }
}
