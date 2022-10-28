import {ActionAuth} from './auth';
import {ActionLogIn} from './login';
import {ActionNotice} from './notice';
import {ActionRouting} from './routing';

export enum ActionType {
  LOGIN,
  AUTH,
  NOTICE,
  ROUTING,
}

export type Action =
  | ActionLogIn
  | ActionAuth
  | ActionNotice
  | ActionRouting;
