import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export interface PayloadPost {
  postID: number
  author: {
    id: number
    imgPath: string
    username: string
  }
  date: Date
  content: {
    title: string
    img: string
    text: string
  }
  likesNum: number
  isLiked: boolean
  commentsNum: number
}

export interface PayloadPostUpdate {
  postID: number
  content?: {
    title: string
    img: string
    text: string
  }
  likesNum?: number
  isLiked?: boolean
  commentsNum?: number
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
