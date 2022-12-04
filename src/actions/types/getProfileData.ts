import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
import {PayloadPost} from './posts';
import {Subscription} from './subscribe';

export interface PayloadProfileUser {
  id: number,
  avatar: string,
  isAuthor: boolean,
  username: string,
  countSubscriptions: number,
  about?: string,
  countDonaters?: number,
}

/** Результат успешной аутификации */
export interface PayloadGetProfileData {
  user: PayloadProfileUser,
  subscriptions?: Subscription[],
  authorSubscriptions?: Subscription[],
  posts?: PayloadPost[],
}

/** Действие аутификации */
export interface ActionGetProfileData extends IAction {
  type: ActionType.GETPROFILEDATA,
  payload: PayloadGetProfileData,
}
