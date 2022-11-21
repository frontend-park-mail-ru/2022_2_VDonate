import {Action} from '@actions/types/action';
import combineReducers from '@flux/combineReducer';
import formErrorsReducer from './form';
import locationReducer from './location';
import noticeReducer from './notice';
import editorReducer from './editor';
import postsReducer from './posts';
import profileReducer from './profile';
import userReducer from './user';
import UserSubscribersReducer from './userSubscribers';

export default combineReducers<Action>({
  location: locationReducer,
  user: userReducer,
  profile: profileReducer,
  formErrors: formErrorsReducer,
  posts: postsReducer,
  notice: noticeReducer,
  userSubscribers: UserSubscribersReducer,
  editor: editorReducer,
});
