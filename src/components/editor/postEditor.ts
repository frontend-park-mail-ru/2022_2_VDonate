import {closeEditor} from '@actions/handlers/editor';
import {Button, ButtonType} from '@components/button/button';
import {InputField, InputType} from '@components/input-field/inputField';
import template from './editor.hbs';
import './editor.styl';

interface EditorPostData {
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
  constructor(data: EditorPostData) {
    const back = document.createElement('div');
    back.classList.add('editor', 'editor__back');
    this.element = back;

    const form = document.createElement('form');
    form.className = 'editor__form';
    form.insertAdjacentHTML(
        'afterbegin',
        template({title: 'Редактирование поста'}),
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
      value: data.title,
    });
    const textInput = new InputField(InputType.textarea, {
      label: 'Основной текст',
      name: 'text',
      placeholder: 'Место для основного текста',
      value: data.text,
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
        },
    );
  }
}
