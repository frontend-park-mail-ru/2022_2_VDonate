import ViewBase from '@flux/types/view';
import store from './Store';

export default
abstract class UpgradeViewBase extends ViewBase<never> {
  constructor() {
    super();
    store.registerObserver(this);
  }

  erase(): void {
    store.removeObserver(this);
    this.onErase();
    this.remove();
  }

  update(data: never): void {
    return data;
  }

  protected abstract onErase(): void;
}
