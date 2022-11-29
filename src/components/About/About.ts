import {Glass, GlassType} from '@components/glass/glass';
import ComponentBase from '@flux/types/component';
import './about.styl';

interface AboutOptions {
  aboutTextHtml: string
}

/**
 * Модель поля 'Обо мне'
 */
export default
class About extends ComponentBase<'div', string> {
  private content!: HTMLDivElement;

  constructor(el: HTMLElement, private options: AboutOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const about = new Glass(GlassType.mono).element;
    about.classList.add('about', 'about__about');

    const head = document.createElement('div');
    head.classList.add('about__head');
    head.innerText = 'Обо мне';
    about.appendChild(head);

    this.content = document.createElement('div');
    this.content.classList.add('about__text');
    this.content.innerHTML = this.aboutTextHtml;
    about.appendChild(this.content);

    return about;
  }

  update(htmlString: string): void {
    this.options.aboutTextHtml = htmlString;
    this.content.innerHTML = this.aboutTextHtml;
  }

  private get aboutTextHtml(): string {
    return this.options.aboutTextHtml.length === 0 ?
      'Автор пока о себе ничего не рассказал' : this.options.aboutTextHtml;
  }
}
