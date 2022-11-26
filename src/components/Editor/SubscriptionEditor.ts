import {closeEditor} from '@actions/handlers/editor';
import {
  AuthorSubscrptionForm,
  createAuthorSubscription,
  deleteAuthorSubscription,
  editAuthorSubscription} from '@actions/handlers/subscribe';
import {PayloadAuthorSubscriptionErrors} from '@actions/types/subscribe';
import Button, {ButtonType} from '@components/Button/Button';
import InputField, {InputType} from '@components/InputField/InputField';
import ComponentBase from '@flux/types/component';
import template from './editor.hbs';
import './editor.styl';

interface SubscriptionEditorOptions {
  id: number
  title: string
  price: number
  tier: number
  text: string
}

/** */
export default
class SubscriptionEditor
  extends ComponentBase <'div', PayloadAuthorSubscriptionErrors> {
  private inputs: InputField[] = [];

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
    const inputsArea = form.querySelector<HTMLElement>('.editor__inputs');
    if (!inputsArea) throw new Error('Not found .editor__inputs');
    this.inputs.push(new InputField(inputsArea, {
      kind: InputType.text,
      label: 'Заголовок',
      name: 'title',
      placeholder: 'Придумайте заголовок для подписки',
      value: this.options?.title,
    }));
    this.inputs.push(new InputField(inputsArea, {
      kind: InputType.text,
      label: 'Стоимость',
      name: 'price',
      placeholder: 'Введите стоимость подписки',
      value: this.options?.price.toString(),
    }));
    this.inputs.push(new InputField(inputsArea, {
      kind: InputType.text,
      label: 'Уровень',
      name: 'tier',
      placeholder: 'Введите уровень подписки',
      value: this.options?.tier.toString(),
    }));
    this.inputs.push(new InputField(inputsArea, {
      kind: InputType.textarea,
      label: 'Текст',
      name: 'text',
      placeholder: 'Замотивируйте своих донатеров',
      value: this.options?.text,
    }));
    this.inputs.push(new InputField(inputsArea, {
      kind: InputType.file,
      label: 'Загрузите картинку',
      name: 'file',
    }));
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
        clickCallback: deleteAuthorSubscription.bind(this, this.options.id),
      });
    }
  }

  update(errors: PayloadAuthorSubscriptionErrors): void {
    this.inputs[0].update(Boolean(errors.title));
    this.inputs[1].update(Boolean(errors.price));
    this.inputs[2].update(Boolean(errors.tier));
    this.inputs[3].update(Boolean(errors.text));
  }
}
