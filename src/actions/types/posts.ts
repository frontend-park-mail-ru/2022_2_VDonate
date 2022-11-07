import {IAction} from '@flux/types/actions';
import {ActionType} from './action';

export interface PayloadPost {
  id: number
  img: string
  text: string
  title: string
  user_id: number
}

export interface ActionGetPosts extends IAction {
  type: ActionType.GET_POSTS
  payload: PayloadPost[]
}
