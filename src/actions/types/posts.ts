import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export interface PayloadPost {
  postID: number
  author: {
    id: number
    img: string
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

export interface ActionGetPosts extends IAction {
  type: ActionType.GET_POSTS
  payload: PayloadPost[]
}
