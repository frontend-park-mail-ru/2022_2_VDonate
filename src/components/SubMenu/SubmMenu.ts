import ComponentBase from '@flux/types/component';
import './sub-menu.styl';
import Button, {ButtonOptions} from '@components/Button/Button';

interface SubMenuOptions {
  buttonsOptions: ButtonOptions[];
}

export default class SubMenu extends ComponentBase<'div'> {
  constructor(el: HTMLElement, private options: SubMenuOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const btnArea = document.createElement('div');
    btnArea.classList.add('sub-menu', 'sub-menu__back', 'bg_sub-menu');

    this.options.buttonsOptions.forEach((buttonOptions) => {
      new Button(btnArea, buttonOptions);
    });

    return btnArea;
  }

  update(data: never): void {
    return data;
  }
}
