import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export interface PayloadProfileUser {
  avatar: string,
  isAuthor: boolean,
  username: string,
  countSubscriptions: number,
  about?: string,
  countSubscribers?: number,
}

export interface PayloadProfileSubscription {
  author: {
    id: number,
    avatar: string,
    username: string,
  },
  tier: number,
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
  subscriptions: PayloadProfileSubscription[] | string,
  authorSubscriptions?: PayloadAuthorSubscription[] | string,
}

/** Действие аутификации */
export interface ActionGetProfileData extends IAction {
  type: ActionType.GETPROFILEDATA,
  payload: PayloadGetProfileData,
}
