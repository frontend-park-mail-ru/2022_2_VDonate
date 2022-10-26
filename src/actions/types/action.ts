import {ActionAuth} from './auth';
import {ActionLogIn} from './login';
import {ActionNotice} from './notice';

export enum ActionType {
  AUTH,
  SIGNUP,
  LOGIN,
  LOGOUT,
  NOTICE,
}

export type Action =
  | ActionLogIn
  | ActionAuth
  | ActionNotice;
