import {IAction} from './actions';
import {IObservable} from './observer';
/**
 * Ассоциативный список для описания состояния хранилища.
 *
 * *Value* может быть любым, даже другим *State*, поэтому необходимо
 * использовать именно *any*. Строгая типизация состояния хранилища при
 * необходимости должна быть выполнена все модуля **flux**
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PropTree = Record<string, any>;
/**
 * Диспетчер действий.
 *
 * Принимает на вход реализацию *IAction*
 */
export type Dispatcher<A extends IAction> = (action: A) => void;
/** Интерфейс хранилища */
export interface IStore<A extends IAction> extends IObservable {
  /** Метод отдачи текущего состояния хранилища */
  getState(): PropTree
  /** Метод диспетчера хранилища */
  dispatch: Dispatcher<A>
}
