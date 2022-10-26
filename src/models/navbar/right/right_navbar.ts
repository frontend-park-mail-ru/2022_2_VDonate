import './right_navbar.styl';
import {Glass, GlassType} from '@components/glass/glass';
import {NavbarUnit, OrientType} from '@components/navbar_unit/navbar_unit';
import icon from '@icon/menu.svg';

export enum NavbarType {
  feed,
  profile,
}

/**
 * Модель правого навбара
 */
export class RightNavbar {
  /**
   * Актуальный контейнер правого навбара
   */
  readonly element : HTMLElement;

  /**
   * @param navbarType вид правого навбара
   */
  constructor(navbarType: NavbarType) {
    const glass = new Glass(GlassType.mono);
    this.element = glass.element;
    this.element.classList.remove('glass');
    this.element.classList.add('right-navbar');
    switch (navbarType) {
      case NavbarType.feed:
        this.feedConstruct();
        break;
      default:
        break;
    }
  }

  /**
   * конструктор для ленты
   */
  feedConstruct() {
    let item =
        new NavbarUnit(icon, 'Все публикации', false, '/', OrientType.right);
    this.element.appendChild(item.element);
    item = new NavbarUnit(icon, 'Доступные', false, '/', OrientType.right);
    this.element.appendChild(item.element);
    item = new NavbarUnit(icon, 'Понравилось', true, '/', OrientType.right);
    this.element.appendChild(item.element);
  }
}
