import {closeEditor} from '@actions/handlers/editor';
import {
  AuthorSubscrptionForm,
  createAuthorSubscription,
  editAuthorSubscription} from '@actions/handlers/subscribe';
import {Button, ButtonType} from '@components/button/button';
import {InputField, InputType} from '@components/input-field/inputField';
import template from './editor.hbs';
import './editor.styl';

interface EditorSubscriptionData {
  id: number
  title: string
  price: number
  tier: number
  text: string
}

/** */
export default class SubscriptionEditor {
  readonly element: HTMLElement;
  private inputs: InputField[] = [];
  private submitBtn: Button;
  /**
   * Конструктор
   * @param data - контекст редактора
   */
  constructor(data?: EditorSubscriptionData) {
    const back = document.createElement('div');
    back.classList.add('editor', 'editor__back');
    this.element = back;

    const form = document.createElement('form');
    form.className = 'editor__form';
    if (data) {
      form.insertAdjacentHTML(
          'afterbegin',
          template({title: 'Редактирование подписки'}),
      );
      this.submitBtn = new Button(ButtonType.primary, 'Изменить', 'submit');
    } else {
      form.insertAdjacentHTML(
          'afterbegin',
          template({title: 'Создание подписки'}),
      );
      this.submitBtn = new Button(ButtonType.primary, 'Создать', 'submit');
    }
    back.appendChild(form);
    const canselBtn = new Button(ButtonType.outline, 'Отмена', 'button');
    canselBtn.element.addEventListener('click',
        () => {
          closeEditor();
        });
    form.querySelector('.editor__btn-area')?.append(
        this.submitBtn.element,
        canselBtn.element,
    );

    const inputsArea = this.element.querySelector('.editor__inputs');
    const titleInput = new InputField(InputType.text, {
      label: 'Заголовок',
      name: 'title',
      placeholder: 'Придумайте заголовок для подписки',
      value: data?.title,
    });
    const priceInput = new InputField(InputType.text, {
      label: 'Стоимость',
      name: 'price',
      placeholder: 'Введите стоимость подписки',
      value: data?.price.toString(),
    });
    const tierInput = new InputField(InputType.text, {
      label: 'Уровень',
      name: 'tier',
      placeholder: 'Введите уровень подписки',
      value: data?.tier.toString(),
    });
    const textInput = new InputField(InputType.textarea, {
      label: 'Текст',
      name: 'text',
      placeholder: 'Замотивируйте своих донатеров',
      value: data?.text,
    });
    const fileInput = new InputField(InputType.file, {
      label: 'Загрузите картинку',
      name: 'file',
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
          if (data) {
            editAuthorSubscription(data.id,
              (e.target as HTMLFormElement).elements as AuthorSubscrptionForm,
            );
          } else {
            createAuthorSubscription(
              (e.target as HTMLFormElement).elements as AuthorSubscrptionForm,
            );
          }
        });
  }
}
