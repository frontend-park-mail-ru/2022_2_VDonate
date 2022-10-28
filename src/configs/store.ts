import {StateLocation} from '@actions/types/routing';
import {Pages} from './router';

const initinalState: {
  location: StateLocation,
} = {
  location: {
    type: Pages.PRELOAD,
  },
};

export default initinalState;
