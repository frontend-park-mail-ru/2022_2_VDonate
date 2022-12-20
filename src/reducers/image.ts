import {Action, ActionType} from '@actions/types/action';
import {Reducer} from '@flux/types/reducer';
import {PropTree} from '@flux/types/store';

const imageReducer: Reducer<Action> =
  (state: PropTree, action: Action): PropTree => {
    switch (action.type) {
      case ActionType.PUT_IMAGE:
        return action.payload;
      case ActionType.ROUTING:
        if (action.payload.options.samePage) {
          return state;
        }
        return {
          url: '',
        };
      default:
        return state;
    }
  };

export default imageReducer;
