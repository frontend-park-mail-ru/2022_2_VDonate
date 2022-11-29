import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export interface PayloadPost {
  author: {
    userID: number
    imgPath: string
    username: string
  }
  content: string
  dateCreated: Date
  isAllowed: boolean
  isLiked: boolean
  likesNum: number
  postID: number
  // tags
  tier: number
  userID: number
  commentsNum: number
}

export interface PayloadPostUpdate {
  postID: number
  content?: string
  likesNum?: number
  isLiked?: boolean
  commentsNum?: number
}

export interface PayloadPostDelete {
  postID: number
}

export interface ActionGetPosts extends IAction {
  type: ActionType.GET_POSTS
  payload: PayloadPost[]
}

export interface ActionUpdatePost extends IAction {
  type: ActionType.UPDATE_POST
  payload: PayloadPostUpdate
}

export interface ActionCreatePost extends IAction {
  type: ActionType.CREATE_POST
  payload: PayloadPost
}

export interface ActionDeletePost extends IAction {
  type: ActionType.DELETE_POST
  payload: PayloadPostDelete
}

export interface ActionPutImage extends IAction {
  type: ActionType.PUT_IMAGE,
  payload: {
    url: string,
  }
}
