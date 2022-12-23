import {closeEditor} from '@actions/handlers/editor';
import {editUser, EditUserFormElements} from '@actions/handlers/user';
import Button, {ButtonType} from '@components/Button/Button';
import InputField, {InputType} from '@components/InputField/InputField';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import template from './editor.hbs';
import closeIcon from '@icon/close.svg';
import './editor.styl';

interface ProfileEditorOptions {
  id: number
  email: string
  username: string
}

interface PostEditorInputsErrors {
  email: boolean
  username: boolean
  password: boolean
  repeatPassword: boolean
}


/** */
export default
class ProfileEditor extends ComponentBase <'div', PostEditorInputsErrors> {
  private inputs = new Map<string, InputField>();
  private submitBtn!: Button;

  constructor(el: HTMLElement, private options: ProfileEditorOptions) {
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

    form.addEventListener('submit',
        (e) => {
          e.preventDefault();
          this.submitBtn.update({blocked: true});
          editUser(
              this.options.id,
            (e.target as HTMLFormElement).elements as EditUserFormElements,
          );
        },
    );

    return editor;
  }

  update(errors: PostEditorInputsErrors): void {
    Object.entries(errors).forEach(([name, value]) => {
      this.inputs.get(name)?.update(value as boolean);
    });
  }

  updateDisabled(): void {
    this.submitBtn.update({blocked: false});
  }

  private createForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.classList.add('editor__form', 'bg_main');
    form.insertAdjacentHTML(
        'afterbegin',
        template({title: 'Редактирование профиля'}),
    );
    return form;
  }

  private addInputs(form: HTMLFormElement) {
    const inputsArea = querySelectorWithThrow(form, '.editor__inputs');
    this.inputs
        .set('email', new InputField(inputsArea, {
          kind: InputType.EMAIL,
          label: 'Почта',
          name: 'email',
          placeholder: 'Введите почту',
          value: this.options.email,
          displayError: false,
          title: 'Почта должна быть в корректном формате',
        }))
        .set('username', new InputField(inputsArea, {
          kind: InputType.USERNAME,
          label: 'Псевдоним',
          name: 'username',
          placeholder: 'Введите псевдоним',
          value: this.options.username,
          displayError: false,
          title: 'Псевдоним должен содержать не менее 3 символов',
        }));
    this.inputs
        .set('password', new InputField(inputsArea, {
          kind: InputType.PASSWORD,
          label: 'Пароль',
          name: 'password',
          placeholder: 'Введите пароль',
          displayError: false,
          title: 'Пароль должен содержать не менее 5 символов',
        }))
        .set('repeatPassword', new InputField(inputsArea, {
          kind: InputType.PASSWORD,
          label: 'Повторите пароль',
          name: 'repeatPassword',
          placeholder: 'Точно также',
          displayError: false,
          title: 'Пароли должны совпадать',
        }))
        .set('avatar', new InputField(inputsArea, {
          kind: InputType.IMAGE,
          label: 'Загрузите аватарку',
          name: 'avatar',
          displayError: false,
          title: 'Загрузите аватарку',
        }));
  }

  private addButtons(form: HTMLFormElement) {
    const btnArea = querySelectorWithThrow(form, '.editor__btn-area');

    this.submitBtn = new Button(btnArea, {
      viewType: ButtonType.PRIMARY,
      innerText: 'Изменить',
      actionType: 'submit',
    });
    this.submitBtn.addClassNames('btn-area__btn');
    new Button(btnArea, {
      viewType: ButtonType.OUTLINE,
      innerText: 'Отменить',
      actionType: 'button',
      clickHandler: () => {
        closeEditor();
      },
    }).addClassNames('btn-area__btn');

    new Button(form, {
      viewType: ButtonType.ICON,
      actionType: 'button',
      innerIcon: closeIcon,
      clickHandler: () => {
        closeEditor();
      },
    }).addClassNames('editor__close-btn');
  }
}
