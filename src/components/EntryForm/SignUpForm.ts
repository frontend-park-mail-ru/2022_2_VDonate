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
  greeting: 'Скорее присоединяйся к нам!',
  link: '/login',
  textLink: 'Мне кажется, или мы знакомы? Войти',
};
/** Контекст для полей ввода */
const signUpInputs: InputOptions[] = [
  {
    kind: InputType.email,
    label: 'Почта',
    placeholder: 'Для нашего личного общения',
    name: 'email',
  },
  {
    kind: InputType.username,
    label: 'Псевдоним',
    placeholder: 'Ваше уникальное имя',
    name: 'username',
  },
  {
    kind: InputType.password,
    label: 'Пароль',
    placeholder: 'Мы обещаем не продавать его',
    name: 'password',
  },
  {
    kind: InputType.password,
    label: 'Повторите пароль',
    placeholder: 'Чтобы точно',
    name: 'repeatPassword',
  },
];

type SignUpInputsErrors = Map<'username' | 'password', boolean>;

/** Модель формы регистрации */
export default
class SignUpForm
  extends ComponentBase<'form', SignUpInputsErrors> {
  /** Список компонентов ввода, используемых в текущем контейнере */
  private inputs = new Map<string, InputField>();

  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
  }

  update(errors: SignUpInputsErrors): void {
    errors.forEach((isError, name) => {
      this.inputs.get(name)?.update(isError);
    });
  }

  protected render(): HTMLFormElement {
    const form = document.createElement('form');
    form.classList.add('signlog', 'signlog__back');
    form.innerHTML = template(signUpContext);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      signup((e.target as HTMLFormElement).elements as SignUpFormElements);
    });

    const inputsArea = querySelectorWithThrow(form, '.signlog__inputs');
    signUpInputs.forEach((options) =>
      this.inputs.set(options.name, new InputField(inputsArea, options)));

    new Button(querySelectorWithThrow(form, '.signlog__submit'), {
      actionType: 'submit',
      innerText: 'Зарегистрироваться',
      viewType: ButtonType.PRIMARY,
    });

    return form;
  }
}
