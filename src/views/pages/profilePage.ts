import store from '@app/store';
import {IView} from '@flux/types/view';
import {IObserver} from '@flux/types/observer';
import {RightNavbar} from '@models/navbar/right/right_navbar';
import {SubContainer} from '@models/subContainer/subContainer';
import {About} from '@models/about/about';
/** Интерфейс структурного представления страницы из компонентов */
interface profileModel {
  root: HTMLElement,
  navbar: RightNavbar,
  subContainer: SubContainer,
  about: About,
}

/** Реализация интерфейса *IView* для страницы профиля */
export default class ProfilePage implements IView, IObserver {
  /** Структорное представление страницы из компонентов */
  private components: profileModel;
  /** Конструктор */
  constructor() {
    const root = document.createElement('div');
    root.classList.add('content');
    const rightNavbar = new RightNavbar();
    const subContainer = new SubContainer(true);
    const about = new About(true);
    root.appendChild(subContainer.element);
    root.appendChild(about.element);
    root.appendChild(rightNavbar.element);
    this.components = {
      root: root,
      navbar: rightNavbar,
      subContainer: subContainer,
      about: about,
    };
    store.registerObserver(this);
  }
  /** Оповещение об изменением хранилища */
  notify(): void {
    this.rerender();
  }
  /** Сброс страницы, отключение от хранилища */
  reset(): void {
    store.removeObserver(this);
    this.components.root.remove();
  }
  /**
   * Создание страницы профиля
   * @returns Страница-элемент
   */
  render(): HTMLElement {
    return this.components.root;
  }
  /** Перерисовка страницы по текущему состоянию хранилища */
  rerender(): void {}// eslint-disable-line @typescript-eslint/no-empty-function
}
