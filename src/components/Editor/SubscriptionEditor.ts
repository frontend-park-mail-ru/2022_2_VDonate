import {closeEditor} from '@actions/handlers/editor';
import {
  AuthorSubscrptionForm,
  createAuthorSubscription,
  deleteAuthorSubscription,
  editAuthorSubscription} from '@actions/handlers/subscribe';
import Button, {ButtonType} from '@components/Button/Button';
import InputField, {InputType} from '@components/InputField/InputField';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import template from './editor.hbs';
import closeIcon from '@icon/close.svg';
import './editor.styl';

interface SubscriptionEditorOptions {
  id: number
  title: string
  price: number
  tier: number
  text: string
}

interface SubscriptionEditorInputsErrors {
  title: boolean
  price: boolean
  tier: boolean
  text: boolean
}

/** */
export default
class SubscriptionEditor
  extends ComponentBase <'div', SubscriptionEditorInputsErrors> {
  private inputs = new Map<string, InputField>();

  constructor(el: HTMLElement, private options?: SubscriptionEditorOptions) {
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

  update(errors: SubscriptionEditorInputsErrors): void {
    Object.entries(errors).forEach(([name, value]) => {
      this.inputs.get(name)?.update(value as boolean);
    });
  }

  private createForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.classList.add('editor__form', 'bg_main');
    form.insertAdjacentHTML(
        'afterbegin',
        template({
          title: this.options ?
          'Редактирование подписки' : 'Создание подписки',
        }),
    );
    form.addEventListener('submit',
        (e) => {
          e.preventDefault();
          if (this.options) {
            editAuthorSubscription(
                this.options.id,
              (e.target as HTMLFormElement).elements as AuthorSubscrptionForm);
          } else {
            createAuthorSubscription(
              (e.target as HTMLFormElement).elements as AuthorSubscrptionForm);
          }
        },
    );
    return form;
  }

  private addInputs(form: HTMLFormElement) {
    const inputsArea = querySelectorWithThrow(form, '.editor__inputs');
    const inputNumbers = document.createElement('div');
    inputNumbers.classList.add('row-inputs');
    this.inputs
        .set('title', new InputField(inputsArea, {
          kind: InputType.text,
          label: 'Заголовок',
          name: 'title',
          placeholder: 'Придумайте заголовок для подписки',
          value: this.options?.title,
          displayError: false,
        }))
        .set('price', new InputField(inputNumbers, {
          kind: InputType.number,
          label: 'Стоимость',
          name: 'price',
          placeholder: 'Введите стоимость подписки',
          value: this.options?.price.toString(),
          displayError: false,
        }))
        .set('tier', new InputField(inputNumbers, {
          kind: InputType.number,
          label: 'Уровень',
          name: 'tier',
          placeholder: 'Введите уровень подписки',
          value: this.options?.tier.toString(),
          displayError: false,
        }));
    this.inputs.get('price')?.addClassNames('row-inputs__input');
    this.inputs.get('tier')?.addClassNames('row-inputs__input');
    inputsArea.appendChild(inputNumbers);
    this.inputs
        .set('text', new InputField(inputsArea, {
          kind: InputType.textarea,
          label: 'Текст',
          name: 'text',
          placeholder: 'Замотивируйте своих донатеров',
          value: this.options?.text,
          displayError: false,
        }))
        .set('file', new InputField(inputsArea, {
          kind: InputType.image,
          label: 'Загрузите картинку (.jpg)',
          name: 'file',
          displayError: false,
        }));
    if (!this.options) {
      querySelectorWithThrow(form, 'input[name="title"]')
          .setAttribute('autofocus', 'true');
    }
  }

  private addButtons(form: HTMLFormElement) {
    const btnArea = querySelectorWithThrow(form, '.editor__btn-area');

    new Button(btnArea, {
      viewType: ButtonType.PRIMARY,
      innerText: this.options ? 'Изменить' : 'Создать',
      actionType: 'submit',
    }).addClassNames('btn-area__btn');
    new Button(btnArea, {
      viewType: ButtonType.OUTLINE,
      innerText: 'Отменить',
      actionType: 'button',
      clickHandler: closeEditor,
    }).addClassNames('btn-area__btn');
    if (this.options) {
      new Button(btnArea, {
        viewType: ButtonType.ERROR,
        innerText: 'Удалить',
        actionType: 'button',
        clickHandler: deleteAuthorSubscription.bind(this, this.options.id),
      }).addClassNames('btn-area__btn');
    }

    new Button(form, {
      viewType: ButtonType.ICON,
      actionType: 'button',
      innerIcon: closeIcon,
      clickHandler: closeEditor,
    }).addClassNames('editor__close-btn');
  }
}
