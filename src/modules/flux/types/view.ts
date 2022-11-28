import ComponentBase from './component';
import {IObserver} from './observer';

/** Интерфейс вьюшки. */
export default abstract class ViewBase<D>
  extends ComponentBase<'div', D> implements IObserver {
  abstract erase(): void;
  abstract notify(): void;
}
