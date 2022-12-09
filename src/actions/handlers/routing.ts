import router from '@app/Router';
import store from '@app/Store';
import {ActionType} from '@actions/types/action';
import {
  ActionRouting,
  PayloadLocation,
  RouteType} from '@actions/types/routing';
import {Pages} from '@configs/router';

export default (loc: string, type?: RouteType): void => {
  const action: ActionRouting = {
    type: ActionType.ROUTING,
    payload: {
      type: router.go(loc, type),
      options: {},
    },
  };
  switch (action.payload.type) {
    case Pages.PROFILE:
      action.payload.options.id = new URL(loc, 'http://vdonate.ml').searchParams.get('id');
      break;
  }
  const locationState = (store.getState().location as PayloadLocation);
  action.payload.options.samePage =
      (locationState.type == action.payload.type &&
      locationState.options.id == action.payload.options.id);
  store.dispatch(action);
};
