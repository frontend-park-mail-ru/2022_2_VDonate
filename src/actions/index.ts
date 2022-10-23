import {ActionLogIn} from './login';
import {ActionSignUp} from './signup';

type Action =
  | ActionSignUp
  | ActionLogIn;

export default Action;
