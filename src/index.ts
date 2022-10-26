'use_strict';

import auth from '@actions/auth';
import store from '@app/store';

auth(store.dispatch.bind(store));
