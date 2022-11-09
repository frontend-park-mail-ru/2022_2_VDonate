import {postEditor} from '@actions/handlers/editor';
import {Button, ButtonType} from '@components/button/button';
import {InputField, InputType} from '@components/input-field/inputField';
import template from './editor.hbs';
import './editor.styl';
export enum EditorTitle {
  POST = 'Изменить пост',
  PROFILE = 'Изменить профиль',
  SUBSCRIBTION = 'Изменить подписку',
}
interface EditorPostData {
  editorTitle: EditorTitle.POST
  title: string
  text: string
}
interface EditorProfileData {
  editorTitle: EditorTitle.PROFILE
  email: string
  username: string
}
interface EditorSubscriptionData {
  editorTitle: EditorTitle.SUBSCRIBTION
  title: string
  price: number
  tier: number
  text: string
}

/** */
export default class Editor {
  readonly element: HTMLElement;
  /**
   * Конструктор
   * @param data - контекст редактора
   */
  constructor(
      data:
      | EditorPostData
      | EditorProfileData
      | EditorSubscriptionData,
  ) {
    const back = document.createElement('div');
    back.classList.add('editor', 'editor__back');
    this.element = back;

    const form = document.createElement('form');
    form.className = 'editor__form';
    form.insertAdjacentHTML(
        'afterbegin',
        template({title: data.editorTitle}),
    );
    back.appendChild(form);

    const submitBtn = new Button(ButtonType.primary, 'Изменить', 'submit');
    const canselBtn = new Button(ButtonType.outline, 'Отмена', 'button');
    canselBtn.element.addEventListener('click',
        () => {
          postEditor(null);
        });
    form.querySelector('.editor__btn-area')?.append(
        submitBtn.element,
        canselBtn.element,
    );

    const inputsArea = form.querySelector('.editor__inputs');
    switch (data.editorTitle) {
      case EditorTitle.POST: {
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
        submitBtn.element.addEventListener('submit',
            (e) => {
              e.preventDefault();
              // TODO экшен изменения поста
            });
        break;
      }
      case EditorTitle.PROFILE: {
        const emailInput = new InputField(InputType.email, {
          label: 'Почта',
          name: 'email',
          placeholder: 'Введите почту',
          value: data.email,
        });
        const usernameInput = new InputField(InputType.username, {
          label: 'Псевдноним',
          name: 'username',
          placeholder: 'Введите псевдоним',
          value: data.username,
        });
        const passwordInput = new InputField(InputType.username, {
          label: 'Пароль',
          name: 'password',
          placeholder: 'Введите пароль',
        });
        const repeatPasswordInput = new InputField(InputType.username, {
          label: 'Повторите пароль',
          name: 'repeatPassword',
          placeholder: 'Точно также',
        });
        const fileInput = new InputField(InputType.file, {
          label: 'Загрузите аватарку',
          name: 'img',
        });
        inputsArea?.append(
            emailInput.element,
            usernameInput.element,
            passwordInput.element,
            repeatPasswordInput.element,
            fileInput.element,
        );
        submitBtn.element.addEventListener('submit',
            (e) => {
              e.preventDefault();
            // TODO экшен изменения профиля
            });
        break;
      }
      case EditorTitle.SUBSCRIBTION: {
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
        submitBtn.element.addEventListener('submit',
            (e) => {
              e.preventDefault();
            // TODO экшен изменения профиля
            });
        break;
      }
      default: {
        const _exhaustiveCheck: never = data;
        return _exhaustiveCheck;
      }
    }
  }
}
