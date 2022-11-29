import ViewBase from '@flux/types/view';
import store from './Store';

export default
abstract class ContainerBase<D> extends ViewBase<D> {
  constructor() {
    super();
    store.registerObserver(this);
  }

  erase(): void {
    store.removeObserver(this);
    this.remove();
  }
}
