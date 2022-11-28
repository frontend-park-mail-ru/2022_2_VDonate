import ComponentBase from '@flux/types/component';
import './navbar-link.styl';

interface NavbarLinkOptions {
  icon: string
  text: string
  href: string
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

  protected render(): HTMLAnchorElement {
    const link = document.createElement('a');
    link.setAttribute('href', this.options.href);
    link.setAttribute('data-link', '');
    link.classList.add('navbar-unit');

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

  update(isChoosed: boolean): void {
    if (isChoosed) this.domElement.classList.add('navbar-unit__choosen');
    else this.domElement.classList.remove('navbar-unit__choosen');
  }
}
