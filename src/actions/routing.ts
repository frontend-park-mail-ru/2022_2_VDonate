import {Pages, routes} from '@configs/router';
import {ActionType} from './types/action';
import {ActionRouting, dispatch} from './types/routing';

export default (loc: string): void => {
  const page = routes.find(
      (obj) => loc.match(obj.path),
  );

  const action: ActionRouting = {
    type: ActionType.ROUTING,
    payload: {
      type: page?.type ?? Pages.NOT_FOUND,
    },
  };

  switch (action.payload.type) {
    case Pages.PROFILE:
      action.payload.options = {
        id: new URL(loc).searchParams.get('id'),
      };
      break;
  }

  dispatch(action);
};
