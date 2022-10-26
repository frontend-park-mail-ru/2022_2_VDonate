import {Action} from '@actions/types/action';
import combineReducers from '@flux/combineReducer';
import userReducer from './user';

export default combineReducers<Action>({
  user: userReducer,
});
