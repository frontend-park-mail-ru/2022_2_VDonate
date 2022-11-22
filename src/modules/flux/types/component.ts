export default
abstract class ComponentBase<DomElement extends HTMLElement, Data> {
  protected domElement: DomElement;

  constructor(element: HTMLElement) {
    this.domElement = this.render();
    element.appendChild(this.domElement);
  }

  addClassNames(...classNames: string[]) {
    this.domElement.classList.add(...classNames);
  }

  remove() {
    this.domElement.remove();
  }

  abstract update(data: Data): void;

  protected abstract render(): DomElement;
}

export const querySelectorWithThrow =
  (element: HTMLElement, selector: string): HTMLElement => {
    const tmp = element.querySelector<HTMLElement>(selector);
    if (!tmp) throw new Error('Нет элемента с ' + selector);
    return tmp;
  };
