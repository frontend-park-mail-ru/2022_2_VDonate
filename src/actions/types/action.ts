import {ActionChangeUserData} from './changeUserData';
import {ActionGetProfileData} from './getProfileData';
import {ActionSubscribe} from './subscribe';
import {ActionNotice} from './notice';
import {ActionGetPosts} from './posts';
import {ActionRouting} from './routing';
import {
  ActionLogInSuccess,
  ActionLogInFail,
  ActionSignUpSuccess,
  ActionSignUpFail,
  ActionAuth,
} from './user';
import {ActionPostEditor} from './editor';
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
  POST_EDITOR,
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
  | ActionGetPosts
  | ActionPostEditor;
