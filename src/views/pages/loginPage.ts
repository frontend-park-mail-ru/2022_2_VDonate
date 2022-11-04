import store from '@app/store';
import {IView} from '@flux/types/view';
import {IObserver} from '@flux/types/observer';
import {SignLog, SignLogType} from '@models/signlog/signlog';
/** Реализация интерфейса *IView* для страницы входа */
export default class LoginPage implements IView, IObserver {
  /** Структорное представление страницы из компонентов */
  private components: SignLog;
  /** Конструктор */
  constructor() {
    this.components = new SignLog(SignLogType.login);
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
   * Создание страницы входа
   * @returns Страница-элемент
   */
  render(): HTMLElement {
    return this.components.element;
  }
  /** Перерисовка страницы по текущему состоянию хранилища */
  rerender(): void {}// eslint-disable-line @typescript-eslint/no-empty-function
}
