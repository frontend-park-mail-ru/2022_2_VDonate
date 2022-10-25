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
export type State = Record<string, any>;

/** Интерфейс хранилища */
export interface IStore {
  /** Получение сосотояния хранилища */
  getState: () => State

  /** Регистрация наблюдателя по паттерну Observer */
  registerObserver: (observer: ObserverCallback) => void

  /** Оповещение наблюдателя по паттерну Observer */
  notifyObservers: () => void

  /** Распределение пришедшего действия в отдельную область хранилища */
  dispatch: (action: IAction) => void
}

export type Dispatcher = (action: IAction) => void;
