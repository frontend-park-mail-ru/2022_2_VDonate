import {PayloadNotice} from '@actions/types/notice';
import {PayloadLocation} from '@actions/types/routing';
import {Pages} from './router';

const initinalState: {
  location: PayloadLocation,
  notice: PayloadNotice,
} = {
  location: {
    type: Pages.PRELOAD,
  },
  notice: {
    message: null,
  },
};

export default initinalState;
