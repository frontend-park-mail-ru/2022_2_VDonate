import './glass.styl';

/**
 * Перчисление типов стекла
 */
export enum GlassType {
  mono,
  blackHard,
  lines,
}

/**
 * Компонент стекло
 */
export class Glass {
  /**
   * Актуальный контейнер стекла
   */
  readonly element : HTMLElement;

  /**
   * @param viewType дизайн стекла
   */
  constructor(
      viewType: GlassType,
  ) {
    this.element = document.createElement('div');
    this.element.classList.add('glass');
    switch (viewType) {
      case GlassType.mono:
        this.element.classList.add('glass__mono');
        break;
      case GlassType.blackHard:
        this.element.classList.add('glass__black-hard');
        break;
      case GlassType.lines:
        this.element.classList.add('glass__lines');
        break;
      default:
        this.element.classList.add('glass__mono');
        break;
    }
  }
}
