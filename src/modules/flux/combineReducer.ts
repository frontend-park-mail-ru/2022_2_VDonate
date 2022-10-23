import {IAction} from './types/actions';
import {Reducer} from './types/reducer';
import {State} from './types/store';

const combineReducers =
  (reducers: Record<string, Reducer>): Reducer =>
    (store: State, action: IAction): State => {
      Object.entries(reducers).forEach(
          ([key, reducer]) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            store[key] = reducer(store[key], action);
          },
      );
      return store;
    };

export default combineReducers;
