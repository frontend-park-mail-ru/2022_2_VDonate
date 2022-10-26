import {IAction} from './types/actions';
import {Reducer} from './types/reducer';
import {Map, IStore} from './types/store';

/** Хранилище состояния. */
export default class Store<A extends IAction> implements IStore<A> {
  /** Текущее состояние хранилища */
  private state: Map;
  /** Список наблюдателей за хранилищем */
  private observers: (() => void)[] = [];
  /** Универсальный обработчик действий */
  private reducer: Reducer<A>;

  /**
   * @param reducer - что-то наполненное магией
   * @param initinalState - начальное состояние хранилища
   */
  constructor(reducer: Reducer<A>, initinalState: Map = {}) {
    this.state = initinalState;
    this.reducer = reducer;
  }

  /**
   * Чтение текущего состояни хранилища
   * @returns Текущее состояние дерева хранилища
   */
  getState(): Map {
    return this.state;
  }

  /**
   * Регистрация наблюдателей
   * @param observer - наблюдатель за состоянием хранилища
   */
  registerObserver(observer: () => void) {
    this.observers.push(observer);
  }

  /** Оповещение всех наблюдателей */
  notifyObservers() {
    this.observers.forEach((observer) => observer());
  }

  /**
   * Применение действия на текущем хранилище
   * @param action вызывающее событие
   */
  dispatch(action: A) {
    this.state = this.reducer(this.state, action);
    this.notifyObservers();
  }
}
