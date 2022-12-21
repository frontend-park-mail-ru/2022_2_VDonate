import {IAction} from './types/actions';
import {IObserver} from './types/observer';
import {Reducer} from './types/reducer';
import {PropTree, IStore} from './types/store';
/** Хранилище состояния. */
export default class Store<A extends IAction> implements IStore<A> {
  /** Текущее состояние хранилища */
  private state: PropTree;
  /** Список наблюдателей за хранилищем */
  private observers: Set<IObserver>;
  /** Универсальный обработчик действий */
  private reducer: Reducer<A>;
  /**
   * Конструктор
   * @param reducer - внешний распределитель действий
   * @param initialState - начальное состояние хранилища
   */
  constructor(reducer: Reducer<A>, initialState: PropTree = {}) {
    this.state = initialState;
    this.reducer = reducer;
    this.observers = new Set();
  }
  /**
   * Чтение текущего состояния хранилища
   * @returns Текущее состояние дерева хранилища
   */
  getState(): PropTree {
    return this.state;
  }
  /**
   * Удаление наблюдателя
   * @param observer - наблюдатель для удаления
   */
  removeObserver(observer: IObserver): void {
    this.observers.delete(observer);
  }
  /**
   * Регистрация наблюдателей
   * @param observer - наблюдатель за состоянием хранилища
   */
  registerObserver(observer: IObserver) {
    this.observers.add(observer);
  }
  /** Оповещение всех наблюдателей */
  notifyObservers() {
    this.observers.forEach((observer) => observer.notify());
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
