import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {FormErrorType} from './formError';
import {PayloadPost} from './posts';

export interface PayloadSubscribe {
  authorSubscriptionID: number
  posts: PayloadPost[]
}

export interface PayloadSubscription {
  authorAvatar: string
  authorID: number
  authorName: string
  id: number
  img: string
  price: number
  text: string
  tier: number
  title: string
}

export interface PayloadSwitchSubscription {
  oldSubscriptionID: number
  newSubscriptionID: number
  posts: PayloadPost[]
}

export interface ActionSubscribe extends IAction {
  type: ActionType.SUBSCRIBE
  payload: PayloadSubscribe
}

export interface ActionUnsubscribe extends IAction {
  type: ActionType.UNSUBSCRIBE
  payload: PayloadSubscribe
}

export interface ActionSwitchSubscription extends IAction {
  type: ActionType.SWITCH_SUBSCRIPTION
  payload: PayloadSwitchSubscription
}

export interface ActionGetSubscriptions extends IAction {
  type: ActionType.GET_SUBSCRIPTIONS
  payload: PayloadSubscription[]
}

export interface PayloadAuthorSubscriptionErrors {
  type: FormErrorType.AUTHOR_SUBSCRIPTION
  price: null | string
  text: null | string
  // tier: null | string
  title: null | string
  file: null | string
}

export interface ActionEditAuthorSubscription extends IAction {
  type: ActionType.EDIT_AUTHOR_SUBSCRIPTION
  payload: {
    subscription?: PayloadSubscription
    formErrors: PayloadAuthorSubscriptionErrors
  }
}

export interface ActionCreateAuthorSubscription extends IAction {
  type: ActionType.CREATE_AUTHOR_SUBSCRIPTION
  payload: {
    subscription?: PayloadSubscription
    formErrors: PayloadAuthorSubscriptionErrors
  }
}

export interface ActionDeleteAuthorSubscription extends IAction {
  type: ActionType.DELETE_AUTHOR_SUBSCRIPTION
  payload: {
    id: number,
  }
}
