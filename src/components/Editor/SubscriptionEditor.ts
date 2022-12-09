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
    form.className = 'editor__form';
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

    this.inputs
        .set('title', new InputField(inputsArea, {
          kind: InputType.text,
          label: 'Заголовок',
          name: 'title',
          placeholder: 'Придумайте заголовок для подписки',
          value: this.options?.title,
          displayError: false,
        }))
        .set('price', new InputField(inputsArea, {
          kind: InputType.text,
          label: 'Стоимость',
          name: 'price',
          placeholder: 'Введите стоимость подписки',
          value: this.options?.price.toString(),
          displayError: false,
        }))
        .set('tier', new InputField(inputsArea, {
          kind: InputType.text,
          label: 'Уровень',
          name: 'tier',
          placeholder: 'Введите уровень подписки',
          value: this.options?.tier.toString(),
          displayError: false,
        }))
        .set('text', new InputField(inputsArea, {
          kind: InputType.textarea,
          label: 'Текст',
          name: 'text',
          placeholder: 'Замотивируйте своих донатеров',
          value: this.options?.text,
          displayError: false,
        }))
        .set('file', new InputField(inputsArea, {
          kind: InputType.file,
          label: 'Загрузите картинку (.jpg)',
          name: 'file',
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
        clickHandler: deleteAuthorSubscription.bind(this, this.options.id),
      });
    }
  }

  // update(errors: PayloadAuthorSubscriptionErrors): void {
  //   this.inputs[0].update(Boolean(errors.title));
  //   this.inputs[1].update(Boolean(errors.price));
  //   this.inputs[2].update(Boolean(errors.tier));
  //   this.inputs[3].update(Boolean(errors.text));
  // }
}
