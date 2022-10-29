import {ActionAuth} from './auth';
import {ActionLogIn} from './login';
import {ActionNotice} from './notice';
import {ActionRouting} from './routing';
/** Типы действий */
export enum ActionType {
  LOGIN,
  AUTH,
  NOTICE,
  ROUTING,
}
/** Объединение действий */
export type Action =
  | ActionLogIn
  | ActionAuth
  | ActionNotice
  | ActionRouting;
