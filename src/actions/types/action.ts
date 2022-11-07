import {ActionAuth} from './auth';
import {ActionChangeUserData} from './changeUserData';
import {ActionGetProfileData} from './getProfileData';
import {ActionLogIn} from './login';
import {ActionNotice} from './notice';
import {ActionRouting} from './routing';
import {ActionSubscribe} from './subscribe';
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
  GETPROFILEDATA,
  CHANGEUSERDATA,
  SUBSCRIBE,
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
  | ActionGetProfileData
  | ActionChangeUserData
  | ActionSubscribe
  | ActionNotice
  | ActionRouting
  | ActionGetPosts;
