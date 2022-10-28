/** Интерфейс наблюдаемого объекта */
export interface IObservable {
  /** Удаление наблюдателя */
  removeObserver(observer: IObserver): void
  /** Регистрация наблюдателя */
  registerObserver(observer: IObserver): void
  /** Оповещение наблюдателя */
  notifyObservers(): void
}
/** Интерфейс объекта-наблюдателя */
export interface IObserver {
  /** Метод, сообщающий о событии */
  notify(): void
}
