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
}

/** Результат успешной аутификации */
export interface PayloadGetProfileData {
  user: PayloadProfileUser,
  userSubscriptions?: PayloadSubscription[],
  authorSubscriptions?: PayloadSubscription[],
  posts?: PayloadPost[],
}

/** Действие аутификации */
export interface ActionGetProfileData extends IAction {
  type: ActionType.GETPROFILEDATA,
  payload: PayloadGetProfileData,
}
