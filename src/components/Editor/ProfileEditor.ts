import {closeEditor} from '@actions/handlers/editor';
import {editUser, EditUserFormElements} from '@actions/handlers/user';
import {FormErrorType} from '@actions/types/formError';
import {PayloadEditUserErrors} from '@actions/types/user';
import Button, {ButtonType} from '@components/Button/Button';
import InputField, {InputType} from '@components/InputField/InputField';
import ComponentBase from '@flux/types/component';
import template from './editor.hbs';
import './editor.styl';

interface ProfileEditorOptions {
  id: number
  email: string
  username: string
  isAuthor: boolean
  about?: string
}

/** */
export default
class ProfileEditor extends ComponentBase <'div', PayloadEditUserErrors> {
  private inputs: InputField[] = [];
  private formErrors: PayloadEditUserErrors = {
    type: FormErrorType.EDIT_USER,
    email: null,
    username: null,
    password: null,
    repeatPassword: null,
    about: null,
    isAuthor: null,
    avatar: null,
  };

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
    const inputsArea = form.querySelector<HTMLElement>('.editor__inputs');
    if (!inputsArea) throw new Error('Not found .editor__inputs');
    this.inputs.push(new InputField(inputsArea, {
      kind: InputType.email,
      label: 'Почта',
      name: 'email',
      placeholder: 'Введите почту',
      value: this.options.email,
    }));
    this.inputs.push(new InputField(inputsArea, {
      kind: InputType.username,
      label: 'Псевдноним',
      name: 'username',
      placeholder: 'Введите псевдоним',
      value: this.options.username,
    }));
    this.inputs.push(this.options.isAuthor ?
      new InputField(inputsArea, {
        kind: InputType.textarea,
        label: 'Описание',
        name: 'about',
        placeholder: 'Расскажите что-то о себе...',
        value: this.options.about,
      }) :
      new InputField(inputsArea, {
        kind: InputType.checkbox,
        label: 'Стать автором',
        name: 'isAuthor',
      }));
    this.inputs.push(new InputField(inputsArea, {
      kind: InputType.password,
      label: 'Пароль',
      name: 'password',
      placeholder: 'Введите пароль',
    }));
    this.inputs.push(new InputField(inputsArea, {
      kind: InputType.password,
      label: 'Повторите пароль',
      name: 'repeatPassword',
      placeholder: 'Точно также',
    }));
    this.inputs.push(new InputField(inputsArea, {
      kind: InputType.file,
      label: 'Загрузите аватарку',
      name: 'avatar',
    }));
  }

  private addButtons(form: HTMLFormElement) {
    const btnArea = form.querySelector<HTMLElement>('.editor__btn-area');
    if (!btnArea) throw new Error('Not found .editor__btn-area');

    new Button(btnArea, {
      viewType: ButtonType.primary,
      innerText: 'Изменить',
      actionType: 'submit',
    });
    new Button(btnArea, {
      viewType: ButtonType.outline,
      innerText: 'Отменить',
      actionType: 'button',
      clickCallback: closeEditor,
    });
  }

  update(errors: PayloadEditUserErrors): void {
    this.inputs[0].update(Boolean(errors.email));
    this.inputs[1].update(Boolean(errors.username));
    this.inputs[3].update(Boolean(errors.password));
    this.inputs[4].update(Boolean(errors.repeatPassword));
  }
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
