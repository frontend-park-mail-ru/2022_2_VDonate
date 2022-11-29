import {PayloadEditor} from '@actions/types/editor';
import {PayloadProfileUser} from '@actions/types/getProfileData';
import {PayloadNotice} from '@actions/types/notice';
import {PayloadPost} from '@actions/types/posts';
import {PayloadLocation} from '@actions/types/routing';
import {Pages} from './router';

const initinalState: {
  location: PayloadLocation,
  notice: PayloadNotice,
  posts: Map<number, PayloadPost>,
  editor: PayloadEditor,
  profile: PayloadProfileUser,
} = {
  location: {
    type: Pages.PRELOAD,
  },
  notice: {
    message: null,
  },
  posts: new Map<number, PayloadPost>(),
  editor: {},
  profile: {
    avatar: '',
    countSubscriptions: 0,
    isAuthor: false,
    id: 0,
    username: 'Псевдоним',
    about: 'Тут будет описание',
    countSubscribers: 0,
  },
};

export default initinalState;
