import {ActionAuth} from './auth';
import {ActionChangeUserData} from './changeUserData';
import {ActionGetProfileData} from './getProfileData';
import {ActionLogIn} from './login';
import {ActionNotice} from './notice';
import {ActionRouting} from './routing';
import {ActionSubscribe} from './subscribe';
/** Типы действий */
export enum ActionType {
  LOGIN,
  AUTH,
  GETPROFILEDATA,
  CHANGEUSERDATA,
  SUBSCRIBE,
  NOTICE,
  ROUTING,
}
/** Объединение действий */
export type Action =
  | ActionLogIn
  | ActionAuth
  | ActionGetProfileData
  | ActionChangeUserData
  | ActionSubscribe
  | ActionNotice
  | ActionRouting;
