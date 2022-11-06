import {ActionAuth} from './auth';
import {ActionGetProfileData} from './getProfileData';
import {ActionLogIn} from './login';
import {ActionNotice} from './notice';
import {ActionRouting} from './routing';
/** Типы действий */
export enum ActionType {
  LOGIN,
  AUTH,
  GETPROFILEDATA,
  NOTICE,
  ROUTING,
}
/** Объединение действий */
export type Action =
  | ActionLogIn
  | ActionAuth
  | ActionGetProfileData
  | ActionNotice
  | ActionRouting;
