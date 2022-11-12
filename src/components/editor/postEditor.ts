import {closeEditor} from '@actions/handlers/editor';
import {createPost, PostForm, updatePost} from '@actions/handlers/posts';
import {PayloadFormError} from '@actions/types/formError';
import {PayloadUser} from '@actions/types/user';
import store from '@app/store';
import {Button, ButtonType} from '@components/button/button';
import {InputField, InputType} from '@components/input-field/inputField';
import template from './editor.hbs';
import './editor.styl';

interface EditorPostData {
  id: number
  title: string
  text: string
}

/** */
export default class PostEditor {
  readonly element: HTMLElement;
  private inputs: InputField[] = [];
  /**
   * Конструктор
   * @param data - контекст редактора
   */
  constructor(data?: EditorPostData) {
    const back = document.createElement('div');
    back.classList.add('editor', 'editor__back');
    this.element = back;

    const form = document.createElement('form');
    form.className = 'editor__form';
    form.insertAdjacentHTML(
        'afterbegin',
        template({title: data ? 'Редактирование поста' : 'Создание поста'}),
    );
    back.appendChild(form);

    const submitBtn = new Button(ButtonType.primary, 'Изменить', 'submit');
    const canselBtn = new Button(ButtonType.outline, 'Отмена', 'button');
    canselBtn.element.addEventListener('click',
        () => {
          closeEditor();
        });
    form.querySelector('.editor__btn-area')?.append(
        submitBtn.element,
        canselBtn.element,
    );
    const inputsArea = form.querySelector('.editor__inputs');
    const titleInput = new InputField(InputType.text, {
      label: 'Заголовок',
      name: 'title',
      placeholder: 'Придумайте заголовок для поста',
      value: data?.title,
    });
    const textInput = new InputField(InputType.textarea, {
      label: 'Основной текст',
      name: 'text',
      placeholder: 'Место для основного текста',
      value: data?.text,
    });
    const fileInput = new InputField(InputType.file, {
      label: 'Загрузите картинку',
      name: 'img',
    });
    inputsArea?.append(
        titleInput.element,
        textInput.element,
        fileInput.element,
    );
    this.inputs.push(titleInput, textInput, fileInput);
    this.element.querySelector('form')?.addEventListener('submit',
        (e) => {
          e.preventDefault();
          // TODO экшен изменения поста
          if (data) {
            updatePost(
                data.id,
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
  }
  /**
   *
   * @param errors -
   */
  errorDisplay(errors: PayloadFormError) {
    if (!errors) {
      return;
    }
  }
}
