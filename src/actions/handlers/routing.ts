import router from '@app/Router';
import store from '@app/Store';
import {Pages} from '@configs/router';
import {ActionType} from '@actions/types/action';
import {ActionRouting, RouteType} from '@actions/types/routing';

export default (loc: string, type?: RouteType): void => {
  const action: ActionRouting = {
    type: ActionType.ROUTING,
    payload: {
      type: router.go(loc, type),
    },
  };

  switch (action.payload.type) {
    case Pages.PROFILE:
      action.payload.options = {
        id: new URL(loc, 'http://vdonate.ml').searchParams.get('id'),
      };
      break;
  }
  store.dispatch(action);
};
