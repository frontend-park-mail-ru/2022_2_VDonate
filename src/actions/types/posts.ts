import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export interface PayloadPost {
  postID: number
  img: string
  text: string
  title: string
  userID: number
}

export interface ActionGetPosts extends IAction {
  type: ActionType.GET_POSTS
  payload: PayloadPost[]
}
