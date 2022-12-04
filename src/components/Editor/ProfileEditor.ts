import {closeEditor} from '@actions/handlers/editor';
import {editUser, EditUserFormElements} from '@actions/handlers/user';
import Button, {ButtonType} from '@components/Button/Button';
import InputField, {InputType} from '@components/InputField/InputField';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import template from './editor.hbs';
import './editor.styl';

interface ProfileEditorOptions {
  id: number
  email: string
  username: string
  isAuthor: boolean
  about?: string
}

interface PostEditorInputsErrors {
  email: boolean
  username: boolean
  password: boolean
  repeatPassword: boolean
  about: boolean
}


/** */
export default
class ProfileEditor extends ComponentBase <'div', PostEditorInputsErrors> {
  private inputs = new Map<string, InputField>();

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

    return editor;
  }

  update(errors: PostEditorInputsErrors): void {
    Object.entries(errors).forEach(([name, value]) => {
      this.inputs.get(name)?.update(value as boolean);
    });
  }

  private createForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.className = 'editor__form';
    form.insertAdjacentHTML(
        'afterbegin',
        template({title: 'Редактирование профиля'}),
    );
    form.addEventListener('submit',
        (e) => {
          e.preventDefault();
          editUser(
              this.options.id,
            (e.target as HTMLFormElement).elements as EditUserFormElements,
          );
        },
    );
    return form;
  }

  private addInputs(form: HTMLFormElement) {
    const inputsArea = querySelectorWithThrow(form, '.editor__inputs');
    this.inputs
        .set('email', new InputField(inputsArea, {
          kind: InputType.email,
          label: 'Почта',
          name: 'email',
          placeholder: 'Введите почту',
          value: this.options.email,
          displayError: false,
        }))
        .set('username', new InputField(inputsArea, {
          kind: InputType.username,
          label: 'Псевдноним',
          name: 'username',
          placeholder: 'Введите псевдоним',
          value: this.options.username,
          displayError: false,
        }));
    if (this.options.isAuthor) {
      this.inputs.set('about', new InputField(inputsArea, {
        kind: InputType.textarea,
        label: 'Описание',
        name: 'about',
        placeholder: 'Расскажите что-то о себе...',
        value: this.options.about,
        displayError: false,
      }));
    } else {
      this.inputs.set('isAuthor', new InputField(inputsArea, {
        kind: InputType.checkbox,
        label: 'Стать автором',
        name: 'isAuthor',
        displayError: false,
      }));
    }
    this.inputs
        .set('password', new InputField(inputsArea, {
          kind: InputType.password,
          label: 'Пароль',
          name: 'password',
          placeholder: 'Введите пароль',
          displayError: false,
        }))
        .set('repeatPassword', new InputField(inputsArea, {
          kind: InputType.password,
          label: 'Повторите пароль',
          name: 'repeatPassword',
          placeholder: 'Точно также',
          displayError: false,
        }))
        .set('avatar', new InputField(inputsArea, {
          kind: InputType.file,
          label: 'Загрузите аватарку',
          name: 'avatar',
          displayError: false,
        }));
  }

  private addButtons(form: HTMLFormElement) {
    const btnArea = querySelectorWithThrow(form, '.editor__btn-area');

    new Button(btnArea, {
      viewType: ButtonType.PRIMARY,
      innerText: 'Изменить',
      actionType: 'submit',
    });
    new Button(btnArea, {
      viewType: ButtonType.OUTLINE,
      innerText: 'Отменить',
      actionType: 'button',
      clickHandler: closeEditor,
    });
  }

  // update(errors: PayloadEditUserErrors): void {
  //   this.inputs[0].update(Boolean(errors.email));
  //   this.inputs[1].update(Boolean(errors.username));
  //   this.inputs[3].update(Boolean(errors.password));
  //   this.inputs[4].update(Boolean(errors.repeatPassword));
  // }
  // /**
  //  *
  //  * @param errors -
  //  */
  // errorDisplay(errors: PayloadEditUserErrors) {
  //   this.inputs[0].errorDetect(Boolean(errors.email));
  //   this.inputs[1].errorDetect(Boolean(errors.username));
  //   this.inputs[3].errorDetect(Boolean(errors.password));
  //   this.inputs[4].errorDetect(Boolean(errors.repeatPassword));
  // }
}
