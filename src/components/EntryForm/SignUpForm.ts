import {signup, SignUpFormElements} from '@actions/handlers/user';
import Button, {ButtonType} from '@components/Button/Button';
import InputField, {
  InputOptions,
  InputType,
} from '@components/InputField/InputField';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import template from './entry-form.hbs';
import './entry-form.styl';
/** Контекст для шаблона */
const signUpContext = {
  title: 'Регистрация',
  greeting: 'Скорее присоединяйтесь к нам!',
  link: '/login',
  textLink: 'Мне кажется, или мы знакомы? Войти!',
};
/** Контекст для полей ввода */
const signUpInputs: InputOptions[] = [
  {
    kind: InputType.EMAIL,
    label: 'Почта',
    placeholder: 'Для нашего личного общения',
    name: 'email',
    displayError: false,
    title: 'Введите почту корректном в формате',
  },
  {
    kind: InputType.USERNAME,
    label: 'Псевдоним',
    placeholder: 'Ваше уникальное имя',
    name: 'username',
    displayError: false,
    title: 'Псевдоним должен содержать не менее 3 символов',
  },
  {
    kind: InputType.PASSWORD,
    label: 'Пароль',
    placeholder: '********',
    name: 'password',
    displayError: false,
    title: 'Пароль должен содержать не менее 5 символов',
  },
  {
    kind: InputType.PASSWORD,
    label: 'Повторите пароль',
    placeholder: '********',
    name: 'repeatPassword',
    displayError: false,
    title: 'Пароли должны совпадать',
  },
];

interface SignUpFormUpdateErrors {
  username: boolean
  email: boolean
  password: boolean
  repeatPassword: boolean
}

/** Модель формы регистрации */
export default
class SignUpForm
  extends ComponentBase<'form', SignUpFormUpdateErrors> {
  /** Список компонентов ввода, используемых в текущем контейнере */
  private inputs = new Map<string, InputField>();

  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
  }

  update(errors: SignUpFormUpdateErrors): void {
    Object.entries(errors).forEach(([name, value]) => {
      this.inputs.get(name)?.update(value as boolean);
    });
  }

  protected render(): HTMLFormElement {
    const form = document.createElement('form');
    form.classList.add('entry-form', 'entry-form__back', 'bg_main');
    form.innerHTML = template(signUpContext);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      signup((e.target as HTMLFormElement).elements as SignUpFormElements);
    });

    const inputsArea = querySelectorWithThrow(form, '.entry-form__inputs');
    signUpInputs.forEach((options) =>
      this.inputs.set(options.name, new InputField(inputsArea, options)));

    querySelectorWithThrow(form, 'input[name="email"]')
        .setAttribute('autofocus', 'true');

    new Button(querySelectorWithThrow(form, '.entry-form__submit'), {
      actionType: 'submit',
      innerText: 'Зарегистрироваться',
      viewType: ButtonType.PRIMARY,
    });

    return form;
  }
}
