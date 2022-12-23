import {ActionGetProfileData} from './getProfileData';
import {
  ActionCreateAuthorSubscription,
  ActionDeleteAuthorSubscription,
  ActionEditAuthorSubscription,
  ActionGetSubscriptions,
  ActionSubscribe,
  ActionSwitchSubscription,
  ActionUnsubscribe} from './subscribe';
import {
  ActionNotice,
} from './notice';
import {
  ActionAddBackNotice,
  ActionClearBackNotice,
} from './backNotice';
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
  ActionEditAbout,
  ActionBecomeAuthor,
  ActionWithdraw,
  ActionWithdrawError,
} from './user';
import {ActionEditorClose, ActionEditorOpen} from './editor';
import {ActionSearch} from './searchAuthor';
import {
  ActionAddComment,
  ActionCloseComments,
  ActionDeleteComment,
  ActionGetComments,
  ActionUpdateComment} from './comments';
/** Типы действий */
export enum ActionType {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  AUTH,
  GET_PROFILEDATA,
  CHANGE_USERDATA_SUCCESS,
  CHANGE_USERDATA_FAIL,
  SUBSCRIBE,
  UNSUBSCRIBE,
  GET_SUBSCRIPTIONS,
  EDIT_AUTHOR_SUBSCRIPTION,
  CREATE_AUTHOR_SUBSCRIPTION,
  DELETE_AUTHOR_SUBSCRIPTION,
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
  EDIT_ABOUT,
  BECOME_AUTHOR,
  SWITCH_SUBSCRIPTION,
  ADD_BACK_NOTICE,
  CLEAR_BACK_NOTICE,
  GET_COMMENTS,
  ADD_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  CLOSE_COMMENTS,
  WITHDRAW,
  WITHDRAW_ERROR,
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
  | ActionPutImage
  | ActionEditAbout
  | ActionBecomeAuthor
  | ActionSwitchSubscription
  | ActionAddBackNotice
  | ActionClearBackNotice
  | ActionGetComments
  | ActionAddComment
  | ActionUpdateComment
  | ActionDeleteComment
  | ActionCloseComments
  | ActionWithdraw
  | ActionWithdrawError;
