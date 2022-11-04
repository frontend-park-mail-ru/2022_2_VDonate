import router from '@app/router';
import store from '@app/store';
import {Pages} from '@configs/router';
import {ActionType} from '@actions/types/action';
import {ActionRouting} from '@actions/types/routing';

export default (loc: string): void => {
  const action: ActionRouting = {
    type: ActionType.ROUTING,
    payload: {
      type: router.go(loc),
    },
  };

  switch (action.payload.type) {
    case Pages.PROFILE:
      action.payload.options = {
        id: new URL(loc).searchParams.get('id'),
      };
      break;
  }

  store.dispatch(action);
};
