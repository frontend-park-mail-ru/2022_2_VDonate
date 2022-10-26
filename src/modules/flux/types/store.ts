import {IAction} from './actions';

/** Функция обратного вызова наблюдателя */
export type ObserverCallback = () => void;

/**
 * Ассоциативный список для описания состояния хранилища.
 *
 * *Value* может быть любым, даже другим *State*, поэтому необходимо
 * использовать именно *any*. Строгая типизация состояния хранилища при
 * необходимоти должна быть выполнена все модуля **flux**
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PropTree = Record<string, any>;

/** Интерфейс хранилища */
export interface IStore<A extends IAction> {
  /** Получение сосотояния хранилища */
  getState: () => PropTree

  /** Регистрация наблюдателя по паттерну Observer */
  registerObserver: (observer: ObserverCallback) => void

  /** Оповещение наблюдателя по паттерну Observer */
  notifyObservers: () => void

  /** Распределение пришедшего действия в отдельную область хранилища */
  dispatch: Dispatcher<A>
}

export type Dispatcher<A extends IAction> = (action: A) => void;
