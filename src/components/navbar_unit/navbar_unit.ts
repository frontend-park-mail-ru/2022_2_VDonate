import './navbar_unit.styl';
/**
 * расположение
 */
export enum OrientType {
  left,
  right,
}

/**
 * Компонент элемента навбара
 */
export class NavbarUnit {
  /**
   * Актуальный контейнер элемента навбара
   */
  readonly element : HTMLElement;
  /**
   * @param icon иконка
   * @param text текст
   * @param choosen индикатор выбора
   * @param href ссылка
   * @param orientation расположение
   */
  constructor(
      icon: string,
      text: string,
      choosen: boolean,
      href: string,
      orientation: OrientType,
  ) {
    this.element = document.createElement('a');
    this.element.setAttribute('href', href);
    this.element.setAttribute('data-link', '');
    this.element.classList.add('navbar-unit');
    if (choosen) {
      this.element.classList.add('navbar-unit__choosen');
    }
    switch (orientation) {
      case OrientType.left:
        this.element.classList.add('navbar-unit__left');
        break;
      case OrientType.right:
        this.element.classList.add('navbar-unit__right');
        break;
      default:
        break;
    }
    const ico = document.createElement('img');
    ico.classList.add('navbar-unit__icon');
    ico.src = icon;
    const context = document.createElement('div');
    context.classList.add('navbar-unit__context');
    context.innerText = text;
    this.element.appendChild(ico);
    this.element.appendChild(context);
  }
}
