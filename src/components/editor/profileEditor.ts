import {closeEditor} from '@actions/handlers/editor';
import {editUser, EditUserForm} from '@actions/handlers/user';
import {PayloadEditUserErrors} from '@actions/types/user';
import {Button, ButtonType} from '@components/button/button';
import {InputField, InputType} from '@components/input-field/inputField';
import template from './editor.hbs';
import './editor.styl';

interface EditorProfileData {
  id: number
  email: string
  username: string
  isAuthor: boolean
  about?: string
}

/** */
export default class ProfileEditor {
  readonly element: HTMLElement;
  private inputs: InputField[] = [];
  /**
   * Конструктор
   * @param data - контекст редактора
   */
  constructor(data: EditorProfileData) {
    const back = document.createElement('div');
    back.classList.add('editor', 'editor__back');
    this.element = back;

    const form = document.createElement('form');
    form.className = 'editor__form';
    form.insertAdjacentHTML(
        'afterbegin',
        template({title: 'Редактирование профиля'}),
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
    this.inputs.push(new InputField(InputType.email, {
      label: 'Почта',
      name: 'email',
      placeholder: 'Введите почту',
      value: data.email,
    }));
    this.inputs.push(new InputField(InputType.username, {
      label: 'Псевдноним',
      name: 'username',
      placeholder: 'Введите псевдоним',
      value: data.username,
    }));
    if (data.isAuthor) {
      this.inputs.push(new InputField(InputType.textarea, {
        label: 'Описание',
        name: 'about',
        placeholder: 'Расскажите что-то о себе...',
        value: data.about,
      }));
    } else {
      this.inputs.push(new InputField(InputType.checkbox, {
        label: 'Стать автором',
        name: 'isAuthor',
        placeholder: 'Расскажите что-то о себе...',
      }));
    }
    this.inputs.push(new InputField(InputType.password, {
      label: 'Пароль',
      name: 'password',
      placeholder: 'Введите пароль',
    }));
    this.inputs.push(new InputField(InputType.password, {
      label: 'Повторите пароль',
      name: 'repeatPassword',
      placeholder: 'Точно также',
    }));
    this.inputs.push(new InputField(InputType.file, {
      label: 'Загрузите аватарку',
      name: 'avatar',
    }));
    this.inputs.forEach(
        (input) => inputsArea?.appendChild(input.element),
    );
    this.element.querySelector('form')?.addEventListener('submit',
        (e) => {
          e.preventDefault();
          // TODO экшен изменения профиля
          editUser(
              data.id,
            (e.target as HTMLFormElement).elements as EditUserForm,
          );
        });
  }
  /**
   *
   * @param errors -
   */
  errorDisplay(errors: PayloadEditUserErrors) {
    this.inputs[0].errorDetect(Boolean(errors.email));
    this.inputs[1].errorDetect(Boolean(errors.username));
    this.inputs[3].errorDetect(Boolean(errors.password));
    this.inputs[4].errorDetect(Boolean(errors.repeatPassword));
  }
}
