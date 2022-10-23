import {IAction} from './actions';
import {State} from './store';

/**
 * Тип функции для получения нового состояния на основе текущего состояния и
 * исполненого действия
 * @param state - текущее состояние
 * @param action - исполненое действие
 * @returns - новое состояние
 */
export type Reducer = (state: State, action: IAction) => State
