import {PayloadLocation} from '@actions/types/routing';
import {Pages} from './router';

const initinalState: {
  location: PayloadLocation,
} = {
  location: {
    type: Pages.PRELOAD,
  },
};

export default initinalState;
