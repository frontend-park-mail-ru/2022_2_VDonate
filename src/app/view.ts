import ViewBase from '@flux/types/view';
import store from './store';

export default
abstract class ViewBaseExtended<D> extends ViewBase<D> {
  constructor() {
    super();
    store.registerObserver(this);
  }

  erase(): void {
    store.removeObserver(this);
    this.remove();
  }
}
