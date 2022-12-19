import ComponentBase from '@flux/types/component';
import './dropbox.styl';

interface DropboxOptions {
  label: string
  name: string
  selected: string
  options: {
    value: string
    text: string
  }[]
}

export default class Dropbox extends ComponentBase<'label'> {
  constructor(el: HTMLElement, private options: DropboxOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLLabelElement {
    const label = document.createElement('label');
    label.classList.add('dropbox', 'dropbox__label', 'font_regular');
    label.innerText = this.options.label;

    const dropbox = document.createElement('select');
    dropbox.classList.add('dropbox__select', 'font_regular', 'bg_input');
    dropbox.name = this.options.name;
    label.appendChild(dropbox);

    this.options.options.forEach((optionContext) => {
      const option = document.createElement('option');
      option.classList.add('dropbox__option', 'font_regular');
      option.value = optionContext.value;
      option.innerText = optionContext.text;
      if (optionContext.value === this.options.selected) {
        option.selected = true;
      }
      dropbox.appendChild(option);
    });

    return label;
  }

  update(data: never): void {
    return data;
  }
}
