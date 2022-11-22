import ComponentBase from './component';
import {IObserver} from './observer';

/** Интерфейс вьюшки. */
export default abstract class ViewBase<P>
  extends ComponentBase<HTMLDivElement, P> implements IObserver {
  abstract erase(): void;
  abstract notify(): void;
}
