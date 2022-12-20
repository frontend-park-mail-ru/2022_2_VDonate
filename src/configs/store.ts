import {PayloadEditor} from '@actions/types/editor';
import {PayloadProfileUser} from '@actions/types/getProfileData';
import {PayloadBackNotice, PayloadNotice} from '@actions/types/notice';
import {PayloadPost} from '@actions/types/posts';
import {PayloadLocation} from '@actions/types/routing';
import {PayloadSubscription} from '@actions/types/subscribe';
import {Pages} from './router';

const initinalState: {
  location: PayloadLocation,
  notice: PayloadNotice,
  posts: Map<number, PayloadPost>,
  editor: PayloadEditor,
  profile: {
    user: PayloadProfileUser,
    subscriptions: PayloadSubscription[],
    authorSubscriptions: PayloadSubscription[],
    posts: PayloadPost[],
  },
  image: {
    url: string,
  },
  userSubscriptions: Map<number, PayloadSubscription>,
  backNotice: PayloadBackNotice[],
} = {
  location: {
    type: Pages.PRELOAD,
    options: {},
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
      countDonaters: 0,
    },
    subscriptions: [],
    authorSubscriptions: [],
    posts: [],
  },
  image: {
    url: '',
  },
  userSubscriptions: new Map<number, PayloadSubscription>(),
  backNotice: [],
};

export default initinalState;
