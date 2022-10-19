import './input.styl';
import input from './input.hbs';

/**
 *
 */
export class Input {
  readonly element: HTMLLabelElement;
  /**
   * @param {string} label
   * @param {string} placeholder
   */
  constructor(label: string, placeholder: string) {
    this.element = document.createElement('label');
    this.element.classList.add('input');
    this.element.innerHTML += input({label, placeholder});
  }
}
