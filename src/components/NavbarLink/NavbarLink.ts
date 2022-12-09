import ComponentBase from '@flux/types/component';
import './navbar-link.styl';

interface NavbarLinkOptions {
  icon: string
  text: string
  href: string
  isActive: boolean
}

/**
 * Компонент элемента навбара
 */
export default
class NavbarLink
  extends ComponentBase<'a', boolean> {
  constructor(el: HTMLElement, private options: NavbarLinkOptions) {
    super();
    this.renderTo(el);
  }

  update(isActive: boolean): void {
    if (this.options.isActive === isActive) return;
    this.options.isActive = isActive;
    if (this.options.isActive) {
      this.domElement.classList.add('navbar-unit__navbar-unit_choosen');
    } else {
      this.domElement.classList.remove('navbar-unit__navbar-unit_choosen');
    }
  }

  protected render(): HTMLAnchorElement {
    const link = document.createElement('a');
    link.setAttribute('href', this.options.href);
    link.setAttribute('data-link', '');
    link.classList.add('navbar-unit', 'navbar-unit__navbar-unit');

    const ico = document.createElement('img');
    ico.classList.add('navbar-unit__icon');
    ico.src = this.options.icon;
    const context = document.createElement('div');
    context.classList.add('navbar-unit__context');
    context.innerText = this.options.text;
    link.appendChild(ico);
    link.appendChild(context);

    return link;
  }
}
