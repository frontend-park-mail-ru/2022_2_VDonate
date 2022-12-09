import ComponentBase from '@flux/types/component';
import './about.styl';

interface AboutOptions {
  aboutTextHtml: string
}

/**
 *
 */
export default
class About extends ComponentBase<'div', string> {
  private content!: HTMLDivElement;

  constructor(el: HTMLElement, private options: AboutOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const about = document.createElement('div');
    about.classList.add('about', 'about__about', 'bg_content');

    const head = document.createElement('div');
    head.classList.add('about__head', 'font_big');
    head.innerText = 'Обо мне';
    about.appendChild(head);

    this.content = document.createElement('div');
    this.content.classList.add('about__text', 'font_regular');
    this.content.innerHTML = this.aboutTextHtml;
    about.appendChild(this.content);

    return about;
  }

  update(htmlString: string): void {
    if (this.options.aboutTextHtml === htmlString) return;
    this.options.aboutTextHtml = htmlString;
    this.content.innerHTML = this.aboutTextHtml;
  }

  private get aboutTextHtml(): string {
    return this.options.aboutTextHtml.length === 0 ?
      'Автор пока о себе ничего не рассказал' : this.options.aboutTextHtml;
  }
}
