import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export interface PayloadComment {
  id: number // id комента
  authorID: number // id автора поста
  userID: number // id автора комента
  userImg: string // аватар автора комента
  userUsername: string // имя автора комента
  content: string // комент
}

export interface PayloadGetComments {
  postID: number
  comments: PayloadComment[]
}

export interface PayloadAddComment {
  postID: number
  comment: PayloadComment
}

export interface PayloadUpdateComment {
  postID: number
  comment: PayloadComment
}

export interface PayloadDeleteComment {
  postID: number
  commentID: number
}

export interface PayloadCloseComments {
  postID: number
}

export interface ActionGetComments extends IAction {
  type: ActionType.GET_COMMENTS
  payload: PayloadGetComments
}

export interface ActionAddComment extends IAction {
  type: ActionType.ADD_COMMENT
  payload: PayloadAddComment
}

export interface ActionUpdateComment extends IAction {
  type: ActionType.UPDATE_COMMENT
  payload: PayloadUpdateComment
}

export interface ActionDeleteComment extends IAction {
  type: ActionType.DELETE_COMMENT
  payload: PayloadDeleteComment
}

export interface ActionCloseComments extends IAction {
  type: ActionType.CLOSE_COMMENTS
  payload: PayloadCloseComments
}
