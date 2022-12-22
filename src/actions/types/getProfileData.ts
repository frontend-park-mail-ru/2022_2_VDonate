import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {PayloadPost} from './posts';
import {PayloadSubscription} from './subscribe';

export interface PayloadProfileUser {
  id: number,
  avatar: string,
  isAuthor: boolean,
  username: string,
  countSubscriptions: number,
  about?: string,
  countDonaters?: number,
  countPosts?: number,
  countProfitMounth?: number,
  countSubscribersMounth?: number,
  balance?: number,
}

/** Результат успешной аутентификации */
export interface PayloadGetProfileData {
  user: PayloadProfileUser,
  userSubscriptions?: PayloadSubscription[],
  authorSubscriptions?: PayloadSubscription[],
  posts?: PayloadPost[],
}

/** Действие аутентификации */
export interface ActionGetProfileData extends IAction {
  type: ActionType.GET_PROFILEDATA,
  payload: PayloadGetProfileData,
}
