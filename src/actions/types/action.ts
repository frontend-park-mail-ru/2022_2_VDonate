import {ActionGetProfileData} from './getProfileData';
import {
  ActionCreateAuthorSubscription,
  ActionDeleteAuthorSubscription,
  ActionEditAuthorSubscription,
  ActionGetSubscriptions,
  ActionSubscribe,
  ActionUnsubscribe} from './subscribe';
import {ActionNotice} from './notice';
import {
  ActionCreatePost,
  ActionDeletePost,
  ActionGetPosts,
  ActionPutImage,
  ActionUpdatePost,
} from './posts';
import {ActionRouting} from './routing';
import {
  ActionLogInSuccess,
  ActionLogInFail,
  ActionSignUpSuccess,
  ActionSignUpFail,
  ActionAuth,
  ActionLogOutSuccess,
  ActionLogOutFail,
  ActionEditUseDataSuccess,
  ActionEditUserFail,
} from './user';
import {ActionEditorClose, ActionEditorOpen} from './editor';
import {ActionSearch} from './searchAuthor';
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
  EDITAUTHORSUBSRIPTION,
  CREATEAUTHORSUBSRIPTION,
  DELETEAUTHORSUBSCRIPTION,
  NOTICE,
  ROUTING,
  GET_POSTS,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  EDITOR_OPEN,
  EDITOR_CLOSE,
  UPDATE_POST,
  CREATE_POST,
  DELETE_POST,
  SEARCH_AUTHORS,
  PUT_IMAGE,
}
/** Объединение действий */
export type Action =
  | ActionEditAuthorSubscription
  | ActionDeleteAuthorSubscription
  | ActionLogInSuccess
  | ActionLogInFail
  | ActionSignUpSuccess
  | ActionSignUpFail
  | ActionLogOutSuccess
  | ActionLogOutFail
  | ActionAuth
  | ActionGetProfileData
  | ActionEditUseDataSuccess
  | ActionEditUserFail
  | ActionSubscribe
  | ActionUnsubscribe
  | ActionGetSubscriptions
  | ActionCreateAuthorSubscription
  | ActionNotice
  | ActionRouting
  | ActionGetPosts
  | ActionEditorOpen
  | ActionEditorClose
  | ActionUpdatePost
  | ActionCreatePost
  | ActionDeletePost
  | ActionSearch
  | ActionPutImage;
