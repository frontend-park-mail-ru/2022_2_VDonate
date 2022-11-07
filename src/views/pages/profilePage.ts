import store from '@app/store';
import {IView} from '@flux/types/view';
import {IObserver} from '@flux/types/observer';
import {ProfileModel} from '@models/profileModel/profileModel';

/** Реализация интерфейса *IView* для страницы профиля */
export default class ProfilePage implements IView, IObserver {
  /** Структорное представление страницы из компонентов */
  private components: ProfileModel;
  /** Конструктор */
  constructor() {
    this.components = new ProfileModel();
    store.registerObserver(this);
  }
  /** Оповещение об изменением хранилища */
  notify(): void {
    this.rerender();
  }
  /** Сброс страницы, отключение от хранилища */
  reset(): void {
    store.removeObserver(this);
    this.components.element.remove();
  }
  /**
   * Создание страницы профиля
   * @returns Страница-элемент
   */
  render(): HTMLElement {
    return this.components.element;
  }
  /** Перерисовка страницы по текущему состоянию хранилища */
  rerender(): void {}// eslint-disable-line @typescript-eslint/no-empty-function
}
