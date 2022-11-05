import {Action} from '@actions/types/action';
import combineReducers from '@flux/combineReducer';
import formErrorsReducer from './form';
import locationReducer from './location';
import userReducer from './user';

export default combineReducers<Action>({
  location: locationReducer,
  user: userReducer,
  formErrors: formErrorsReducer,
});
