import ViewBase from '@flux/types/view';
import store from './store';

export default
abstract class ViewBaseExtended<D> extends ViewBase<D> {
  constructor() {
    super();
    this.beforeRegisterStore();
    store.registerObserver(this);
  }

  protected beforeRegisterStore(): void {
    // По умолчанию ничего не делает
  }

  erase(): void {
    store.removeObserver(this);
    this.remove();
  }
}
