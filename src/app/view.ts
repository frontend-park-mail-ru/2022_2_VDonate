import ViewBase from '@flux/types/view';
import store from './store';

export default
abstract class ViewBaseExtended<P> extends ViewBase<P> {
  constructor() {
    super();
    store.registerObserver(this);
  }

  erase(): void {
    store.removeObserver(this);
    this.remove();
  }
}
