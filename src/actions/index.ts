import {ActionLogIn} from './types/login';
import {ActionSignUp} from './signup';

type Action =
  | ActionSignUp
  | ActionLogIn;

export default Action;
