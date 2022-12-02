import {IAction} from './types/actions';
import {Reducer} from './types/reducer';
import {PropTree} from './types/store';
/**
 * Функция комбинирования нескольких редьюсеров в один обобщенный
 * @param reducers - ассоциативный массив редьюсеров
 * @returns обобщенный редьюсер
 */
const combineReducers =
  <A extends IAction>(reducers: Record<string, Reducer<A>>): Reducer<A> =>
    (state: PropTree, action: A): PropTree => {
      Object.entries(reducers).forEach(
          ([key, reducer]) => {
          // TODO возможно тут можно провести сравнение по полям,
          // чтобы не менять ссылку на объект, если они равны
            state[key] = reducer(state[key] as PropTree, action);
          },
      );
      return state;
    };

export default combineReducers;
