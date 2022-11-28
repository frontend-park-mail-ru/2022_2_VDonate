import {PayloadEditor} from '@actions/types/editor';
import {PayloadNotice} from '@actions/types/notice';
import {PayloadPost} from '@actions/types/posts';
import {PayloadLocation} from '@actions/types/routing';
import {Pages} from './router';

const initinalState: {
  location: PayloadLocation,
  notice: PayloadNotice,
  posts: Map<number, PayloadPost>,
  editor: PayloadEditor,
} = {
  location: {
    type: Pages.PRELOAD,
  },
  notice: {
    message: null,
  },
  posts: new Map<number, PayloadPost>(),
  editor: {},
};

export default initinalState;
