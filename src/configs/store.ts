import {PayloadPostEditor} from '@actions/types/editor';
import {PayloadNotice} from '@actions/types/notice';
import {PayloadPost} from '@actions/types/posts';
import {PayloadLocation} from '@actions/types/routing';
import {Pages} from './router';

const initinalState: {
  location: PayloadLocation,
  notice: PayloadNotice,
  posts: PayloadPost[],
  postEditor: PayloadPostEditor,
} = {
  location: {
    type: Pages.PRELOAD,
  },
  notice: {
    message: null,
  },
  posts: [],
  postEditor: {
    id: null,
  },
};

export default initinalState;
