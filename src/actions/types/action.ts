import {ActionAuth} from './auth';
import {ActionLogInSuccess, ActionLogInFail} from './login';
import {ActionNotice} from './notice';
import {ActionGetPosts} from './posts';
import {ActionRouting} from './routing';
import {ActionSignUpFail, ActionSignUpSuccess} from './signup';
/** Типы действий */
export enum ActionType {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  AUTH,
  NOTICE,
  ROUTING,
  GET_POSTS,
}
/** Объединение действий */
export type Action =
  | ActionLogInSuccess
  | ActionLogInFail
  | ActionSignUpSuccess
  | ActionSignUpFail
  | ActionAuth
  | ActionNotice
  | ActionRouting
  | ActionGetPosts;
