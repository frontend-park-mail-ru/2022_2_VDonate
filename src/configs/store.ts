import {PayloadEditor} from '@actions/types/editor';
import {PayloadProfileUser} from '@actions/types/getProfileData';
import {PayloadNotice} from '@actions/types/notice';
import {PayloadPost} from '@actions/types/posts';
import {PayloadLocation} from '@actions/types/routing';
import {Subscription} from '@actions/types/subscribe';
import {Pages} from './router';

const initinalState: {
  location: PayloadLocation,
  notice: PayloadNotice,
  posts: Map<number, PayloadPost>,
  editor: PayloadEditor,
  profile: {
    user: PayloadProfileUser,
    subscriptions: Subscription[],
    authorSubscriptions: Subscription[],
    posts: PayloadPost[],
  },
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
    user: {
      avatar: '',
      countSubscriptions: 0,
      isAuthor: false,
      id: 0,
      username: 'Псевдоним',
      about: 'Тут будет описание',
      countSubscribers: 0,
    },
    subscriptions: [],
    authorSubscriptions: [],
    posts: [],
  },
};

export default initinalState;
