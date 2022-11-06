import {IAction} from '@flux/types/actions';
import {ActionType} from './action';
/** Результат успешной аутификации */
export interface PayloadGetProfileData {
  profile: {
    about: string,
    avatar: string,
    is_author: boolean,
    username: string,
  },
  authorSubscriptions: {
    img: string,
    price: number,
    text: string,
    tier: number,
    title: string,
  }[],
  subscriptions: {
    // TODO Мы разве получаем не авторов, а сами подписки?
    img: string,
    price: number,
    text: string,
    tier: number,
    title: string,
    // id: string,
    // about: string,
    // avatar: string,
    // is_author: boolean,
    // username: string,
  }[],
  subscribers: {
    about: string,
    avatar: string,
    is_author: boolean,
    username: string,
  }[]
}

/** Действие аутификации */
export interface ActionGetProfileData extends IAction {
  type: ActionType.GETPROFILEDATA,
  payload: {
    profileData: PayloadGetProfileData,
    errors: string[] | undefined,
  }
}
