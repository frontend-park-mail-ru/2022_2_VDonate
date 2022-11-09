import {closeEditor} from '@actions/handlers/editor';
import {Button, ButtonType} from '@components/button/button';
import {InputField, InputType} from '@components/input-field/inputField';
import template from './editor.hbs';
import './editor.styl';

interface EditorSubscriptionData {
  title: string
  price: number
  tier: number
  text: string
}

/** */
export default class SubscriptionEditor {
  readonly element: HTMLElement;
  private inputs: InputField[] = [];
  /**
   * Конструктор
   * @param data - контекст редактора
   */
  constructor(data: EditorSubscriptionData) {
    const back = document.createElement('div');
    back.classList.add('editor', 'editor__back');
    this.element = back;

    const form = document.createElement('form');
    form.className = 'editor__form';
    form.insertAdjacentHTML(
        'afterbegin',
        template({title: 'Редактирование подписки'}),
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

    const inputsArea = this.element.querySelector('.editor__inputs');
    const titleInput = new InputField(InputType.text, {
      label: 'Заголовок',
      name: 'title',
      placeholder: 'Придумайте заголовок для подписки',
      value: data.title,
    });
    const priceInput = new InputField(InputType.text, {
      label: 'Стоимость',
      name: 'price',
      placeholder: 'Введите стоимость подписки',
      value: data.price.toString(),
    });
    const tierInput = new InputField(InputType.text, {
      label: 'Уровень',
      name: 'tier',
      placeholder: 'Введите уровень подписки',
      value: data.tier.toString(),
    });
    const textInput = new InputField(InputType.textarea, {
      label: 'Текст',
      name: 'text',
      placeholder: 'Замотивируйте своих донатеров',
      value: data.text,
    });
    const fileInput = new InputField(InputType.file, {
      label: 'Загрузите картинку',
      name: 'img',
    });
    inputsArea?.append(
        titleInput.element,
        priceInput.element,
        tierInput.element,
        textInput.element,
        fileInput.element,
    );
    this.inputs.push(
        titleInput,
        priceInput,
        tierInput,
        textInput,
        fileInput,
    );
    this.element.querySelector('form')?.addEventListener('submit',
        (e) => {
          e.preventDefault();
          // TODO экшен изменения профиля
        });
  }
}
