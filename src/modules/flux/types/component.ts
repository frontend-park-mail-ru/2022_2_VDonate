export default
abstract class ComponentBase
  <Tag extends keyof HTMLElementTagNameMap, Data = never> {
  protected domElement!: HTMLElementTagNameMap[Tag];

  protected renderTo(element: HTMLElement) {
    this.domElement = this.render();
    element.appendChild(this.domElement);
  }

  addClassNames(...classNames: string[]) {
    this.domElement.classList.add(...classNames);
  }

  removeClassNames(...classNames: string[]) {
    this.domElement.classList.remove(...classNames);
  }

  remove() {
    this.domElement.remove();
  }

  abstract update(data: Data): void;

  protected abstract render(): HTMLElementTagNameMap[Tag];
}

export const querySelectorWithThrow =
  (element: HTMLElement, selector: string): HTMLElement => {
    const tmp = element.querySelector<HTMLElement>(selector);
    if (!tmp) throw new Error('Нет элемента с ' + selector);
    return tmp;
  };
