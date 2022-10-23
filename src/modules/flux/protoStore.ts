import {IAction} from './types/actions';
import {Reducer} from './types/reducer';
import {State, IStore} from './types/store';

/** Хранилище состояния. */
export default class ProtoStore implements IStore {
  /** Текущее состояние хранилища */
  private state: State;
  /** Список наблюдателей за хранилищем */
  private observers: (() => void)[] = [];
  /** Универсальный обработчик действий */
  private reducer: Reducer;

  /**
   * @param reducer - что-то наполненное магией
   * @param initinalState - начальное состояние хранилища
   */
  private constructor(reducer: Reducer, initinalState: State) {
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
  dispatch(action: IAction) {
    this.state = this.reducer(this.state, action);
    this.notifyObservers();
  }
}
