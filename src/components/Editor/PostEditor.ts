import {closeEditor} from '@actions/handlers/editor';
import {
  createPost,
  deletePost,
  PostForm,
  putImage,
  updatePost,
} from '@actions/handlers/posts';
import {PayloadUser} from '@actions/types/user';
import store from '@app/Store';
import Button, {ButtonType} from '@components/Button/Button';
import InputField, {InputType} from '@components/InputField/InputField';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import template from './editor.hbs';
import './editor.styl';

interface PostEditorOptions {
  id: number
  text: string
  tier: number
}


interface PostEditorInputsErrors {
  text: boolean
  title: boolean
}

/** */
export default class PostEditor
  extends ComponentBase<'div', PostEditorInputsErrors> {
  private inputs = new Map<string, InputField>();

  constructor(el: HTMLElement, private options?: PostEditorOptions) {
    super();


    this.renderTo(el);
  }

  update(errors: PostEditorInputsErrors): void {
    Object.entries(errors).forEach(([name, value]) => {
      this.inputs.get(name)?.update(value as boolean);
    });
  }

  protected render(): HTMLDivElement {
    const editor = document.createElement('div');
    editor.classList.add('editor', 'editor__back');

    const form = this.createForm();
    editor.append(form);

    this.addInputs(form);
    this.addButtons(form);

    const image = querySelectorWithThrow(
        form,
        'input[type=file]',
    ) as HTMLInputElement;
    image.addEventListener('change', () => {
      if (image.files && image.files.length !== 0) {
        putImage(image.files[0]);
      }
    });
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
              userID: user.id,
              imgPath: user.avatar,
              username: user.username,
            }, (e.target as HTMLFormElement).elements as PostForm);
          }
        },
    );
    return form;
  }

  private addInputs(form: HTMLFormElement) {
    const inputsArea = querySelectorWithThrow(form, '.editor__inputs');

    this.inputs
        .set('tier', new InputField(inputsArea, {
          kind: InputType.text,
          label: 'Уровень',
          name: 'tier',
          placeholder: 'Введите уровень доступа',
          value: this.options?.tier.toString(),
          displayError: false,
        }))
        .set('text', new InputField(inputsArea, {
          kind: InputType.textarea,
          label: 'Основной текст',
          name: 'text',
          placeholder: 'Место для основного текста',
          value: this.options?.text,
          displayError: false,
        }))
        .set('image', new InputField(inputsArea, {
          kind: InputType.file,
          label: 'Загрузите картинку (.jpg)',
          name: 'image',
          displayError: false,
        }));
  }

  private addButtons(form: HTMLFormElement) {
    const btnArea = querySelectorWithThrow(form, '.editor__btn-area');

    new Button(btnArea, {
      viewType: ButtonType.PRIMARY,
      innerText: this.options ? 'Изменить' : 'Создать',
      actionType: 'submit',
    });
    new Button(btnArea, {
      viewType: ButtonType.OUTLINE,
      innerText: 'Отменить',
      actionType: 'button',
      clickHandler: closeEditor,
    });
    if (this.options) {
      new Button(btnArea, {
        viewType: ButtonType.OUTLINE,
        innerText: 'Удалить',
        actionType: 'button',
        clickHandler: deletePost.bind(this, this.options.id),
      });
    }
  }
}
