import './right_navbar.styl';
import {Glass, GlassType} from '@components/glass/glass';
import {NavbarUnit, OrientType} from '@components/navbar_unit/navbar_unit';
import icon from '@icon/menu.svg';

/**
 * Модель правого навбара
 */
export class RightFilter {
  /**
   * Актуальный контейнер правого навбара
   */
  readonly element: HTMLElement;
  private glass: HTMLElement;
  /**
   * Конструктор
   */
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('right-navbar');
    this.glass = new Glass(GlassType.mono).element;
    this.glass.classList.add('right-navbar__glass');
    this.element.appendChild(this.glass);
    this.glass.classList.add('right-navbar__feed');
    let item =
        new NavbarUnit(icon, 'Все публикации', '/', OrientType.right);
    this.glass.appendChild(item.element);
    item = new NavbarUnit(icon, 'Доступные', '/', OrientType.right);
    this.glass.appendChild(item.element);
    item = new NavbarUnit(icon, 'Понравилось', '/', OrientType.right);
    this.glass.appendChild(item.element);
  }
}
