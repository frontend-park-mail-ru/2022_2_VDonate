import {Action} from '@actions/types/action';
import combineReducers from '@flux/combineReducer';
import formErrorsReducer from './form';
import locationReducer from './location';
import noticeReducer from './notice';
import editorReducer from './editor';
import postsReducer from './posts';
import profileReducer from './profile';
import userReducer from './user';
import userSubscriptionsReducer from './userSubscriptions';
import authorReducer from './authors';
import imageReducer from './image';
import backNoticeReducer from './backNotice';

export default combineReducers<Action>({
  location: locationReducer,
  user: userReducer,
  userSubscriptions: userSubscriptionsReducer,
  profile: profileReducer,
  formErrors: formErrorsReducer,
  posts: postsReducer,
  notice: noticeReducer,
  editor: editorReducer,
  authors: authorReducer,
  image: imageReducer,
  backNotice: backNoticeReducer,
});
