import {ActionType} from 'src/configs/actionConfig';
import {IAction} from 'src/modules/flux/types/actions';

export interface PayloadSignUp {
  email: string
  username: string
  password: string
}

export interface ActionSignUp extends IAction {
  type: ActionType.SIGNUP;
  payload: PayloadSignUp;
}
