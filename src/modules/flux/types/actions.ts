import {PropTree} from './store';
/** Интерфейс для исполненного действия */
export interface IAction {
  /** Тип действия из перечисления `enum` */
  type: number
  /** Данные, соответствующие текущему действию */
  payload: PropTree
}
