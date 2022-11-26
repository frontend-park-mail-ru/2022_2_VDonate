import {closeEditor} from '@actions/handlers/editor';
import {
  createPost,
  deletePost,
  PostForm,
  updatePost,
} from '@actions/handlers/posts';
import {PayloadUser} from '@actions/types/user';
import store from '@app/store';
import Button, {ButtonType} from '@components/Button/Button';
import InputField, {InputType} from '@components/InputField/InputField';
import ComponentBase from '@flux/types/component';
import template from './editor.hbs';
import './editor.styl';

interface PostEditorOptions {
  id: number
  title: string
  text: string
}

/** */
export default class PostEditor
  extends ComponentBase<'div'> {
  private inputs: InputField[] = [];

  constructor(el: HTMLElement, private options?: PostEditorOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const editor = document.createElement('div');
    editor.classList.add('editor', 'editor__back');

    const form = this.createForm();
    editor.append(form);

    this.addInputs(form);
    this.addButtons(form);

    return editor;
  }

  private createForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.className = 'editor__form';
    form.insertAdjacentHTML(
        'afterbegin',
        template({
          title: this.options ?
          'Редактирование поста' : 'Создание поста',
        }),
    );
    form.addEventListener('submit',
        (e) => {
          e.preventDefault();
          if (this.options) {
            updatePost(
                this.options.id,
            (e.target as HTMLFormElement).elements as PostForm,
            );
          } else {
            const user = (store.getState().user as PayloadUser);
            createPost({
              id: user.id,
              imgPath: user.avatar,
              username: user.username,
            }, (e.target as HTMLFormElement).elements as PostForm);
          }
        },
    );
    return form;
  }

  private addInputs(form: HTMLFormElement) {
    const inputsArea = form.querySelector<HTMLInputElement>('.editor__inputs');
    if (!inputsArea) throw new Error('Not found .editor__inputs');

    const titleInput = new InputField(inputsArea, {
      kind: InputType.text,
      label: 'Заголовок',
      name: 'title',
      placeholder: 'Придумайте заголовок для поста',
      value: this.options?.title,
    });
    const textInput = new InputField(inputsArea, {
      kind: InputType.textarea,
      label: 'Основной текст',
      name: 'text',
      placeholder: 'Место для основного текста',
      value: this.options?.text,
    });
    const fileInput = new InputField(inputsArea, {
      kind: InputType.file,
      label: 'Загрузите картинку',
      name: 'img',
    });
    this.inputs.push(titleInput, textInput, fileInput);
  }

  private addButtons(form: HTMLFormElement) {
    const btnArea = form.querySelector<HTMLElement>('.editor__btn-area');
    if (!btnArea) throw new Error('Not found .editor__btn-area');
    new Button(btnArea, {
      viewType: ButtonType.primary,
      innerText: this.options ? 'Изменить' : 'Создать',
      actionType: 'submit',
    });
    new Button(btnArea, {
      viewType: ButtonType.outline,
      innerText: 'Отменить',
      actionType: 'button',
      clickCallback: closeEditor,
    });
    if (this.options) {
      new Button(btnArea, {
        viewType: ButtonType.outline,
        innerText: 'Удалить',
        actionType: 'button',
        clickCallback: deletePost.bind(this, this.options.id),
      });
    }
  }

  update(data: never): void {
    return data;
  }
}
