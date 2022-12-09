import Button, {ButtonType} from '@components/Button/Button';
import editIcon from '@icon/edit.svg';
import {Glass, GlassType} from '@components/glass/glass';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import './about.styl';
import {editAbout} from '@actions/handlers/user';

interface AboutOptions {
  aboutTextHtml: string
  id: number
  changeable: boolean
  inEditState: boolean
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
    const editBtn = new Button(head, {
      viewType: ButtonType.ICON,
      actionType: 'button',
      innerIcon: editIcon,
      clickHandler: () => {
        if (this.options.inEditState) {
          this.options.inEditState = false;
          this.closeEditor();
        } else {
          this.options.inEditState = true;
          this.openEditor();
        }
      },
    });
    editBtn.addClassNames('about__head-btn');
    about.appendChild(head);

    this.content = document.createElement('div');
    this.content.classList.add('about__text');
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

  private openEditor(): void {
    this.content.setAttribute('contenteditable', 'true');
    const form = document.createElement('form');
    form.classList.add('about__form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.options.aboutTextHtml = this.content.innerText;
      editAbout(this.options.id, this.options.aboutTextHtml);
      this.closeEditor();
    });
    const saveBtn = new Button(form, {
      actionType: 'submit',
      viewType: ButtonType.PRIMARY,
      innerText: 'Сохранить',
    });
    saveBtn.addClassNames('about__form-btn');

    const cancelBtn = new Button(form, {
      actionType: 'button',
      viewType: ButtonType.OUTLINE,
      innerText: 'Отмена',
      clickHandler: () => {
        this.content.innerHTML = this.options.aboutTextHtml;
        this.closeEditor();
      },
    });
    cancelBtn.addClassNames('about__form-btn');
    this.domElement.appendChild(form);
  }

  private closeEditor(): void {
    this.options.inEditState = false;
    this.content.setAttribute('contenteditable', 'false');
    querySelectorWithThrow(this.domElement, '.about__form').remove();
  }
}
