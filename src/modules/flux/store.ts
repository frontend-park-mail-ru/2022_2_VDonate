import {IAction} from './types/actions';
import {Reducer} from './types/reducer';
import {State, IStore} from './types/store';

/** Хранилище состояния. */
export default class Store<A extends IAction> implements IStore<A> {
  /** Текущее состояние хранилища */
  private state: State;
  /** Список наблюдателей за хранилищем */
  private observers: (() => void)[] = [];
  /** Универсальный обработчик действий */
  private reducer: Reducer<A>;

  /**
   * @param reducer - что-то наполненное магией
   * @param initinalState - начальное состояние хранилища
   */
  constructor(reducer: Reducer<A>, initinalState: State = {}) {
    this.state = initinalState;
    this.reducer = reducer;
  }

  /**
   * Чтение текущего состояни хранилища
   * @returns Текущее состояние дерева хранилища
   */
  getState(): State {
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
