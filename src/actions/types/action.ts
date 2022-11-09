import {
  ActionChangeUserDataFail,
  ActionChangeUserDataSuccess} from './changeUserData';
import {ActionGetProfileData} from './getProfileData';
import {
  ActionGetSubscriptions,
  ActionSubscribe,
  ActionUnsubscribe} from './subscribe';
import {ActionNotice} from './notice';
import {ActionGetPosts} from './posts';
import {ActionRouting} from './routing';
import {
  ActionLogInSuccess,
  ActionLogInFail,
  ActionSignUpSuccess,
  ActionSignUpFail,
  ActionAuth,
  ActionLogOutSuccess,
  ActionLogOutFail,
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
  CHANGEUSERDATA_SUCCESS,
  CHANGEUSERDATA_FAIL,
  SUBSCRIBE,
  UNSUBSCRIBE,
  GETSUBSCRIPTIONS,
  NOTICE,
  ROUTING,
  GET_POSTS,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  POST_EDITOR,
}
/** Объединение действий */
export type Action =
  | ActionLogInSuccess
  | ActionLogInFail
  | ActionSignUpSuccess
  | ActionSignUpFail
  | ActionLogOutSuccess
  | ActionLogOutFail
  | ActionAuth
  | ActionGetProfileData
  | ActionChangeUserDataSuccess
  | ActionChangeUserDataFail
  | ActionSubscribe
  | ActionUnsubscribe
  | ActionGetSubscriptions
  | ActionNotice
  | ActionRouting
  | ActionGetPosts
  | ActionPostEditor;
