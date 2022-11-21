import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {PayloadPost} from './posts';

export interface PayloadProfileUser {
  id: number,
  avatar: string,
  isAuthor: boolean,
  username: string,
  countSubscriptions: number,
  about?: string,
  countSubscribers?: number,
}

export interface PayloadProfileSubscription {
  authorID: number
  avatar?: string
  username?: string
  id?: number
  img: string
  price: number
  text: string
  tier: number
  title: string
}

export interface PayloadAuthorSubscription {
  authorID: number,
  id: number,
  img: string,
  price: number,
  text: string,
  tier: number,
  title: string,
}

/** Результат успешной аутификации */
export interface PayloadGetProfileData {
  user: PayloadProfileUser,
  subscriptions?: PayloadProfileSubscription[],
  authorSubscriptions?: PayloadAuthorSubscription[],
  posts?: PayloadPost[],
}

/** Действие аутификации */
export interface ActionGetProfileData extends IAction {
  type: ActionType.GETPROFILEDATA,
  payload: PayloadGetProfileData,
}
