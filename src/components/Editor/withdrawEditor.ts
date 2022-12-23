import {closeEditor} from '@actions/handlers/editor';
import Button, {ButtonType} from '@components/Button/Button';
import InputField, {InputType} from '@components/InputField/InputField';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import template from './editor.hbs';
import closeIcon from '@icon/close.svg';
import cardIcon from '@icon/cardIcon.svg';
import phoneIcon from '@icon/phoneIcon.svg';
import './editor.styl';
import {withdraw, WithdrawFormElements} from '@actions/handlers/user';

enum WithdrawType {
  PHONE,
  CARD,
}

export default
class WithdrawEditor
  extends ComponentBase <'div', null> {
  private input?: InputField;
  private withdrawType!: WithdrawType;
  private submitBtn!: Button;

  constructor(el: HTMLElement, private options?: never) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const editor = document.createElement('div');
    editor.classList.add('editor', 'editor__back');

    const form = document.createElement('form');
    form.classList.add('editor__form', 'bg_main');
    form.noValidate = true;
    form.insertAdjacentHTML(
        'afterbegin',
        template({
          title: 'Вывод средств',
        }),
    );

    editor.append(form);
    this.addInputs(form);
    this.addButtons(form);

    form.addEventListener('submit',
        (e) => {
          e.preventDefault();
          this.submitBtn.update({blocked: true});
          withdraw(
            (e.target as HTMLFormElement).elements as WithdrawFormElements,
          );
          return false;
        },
    );

    return editor;
  }

  update(): void {
    //
  }

  updateDisabled(): void {
    this.submitBtn.update({blocked: false});
  }

  private addInputs(form: HTMLFormElement) {
    const inputsArea = querySelectorWithThrow(form, '.editor__inputs');
    const span = document.createElement('div');
    span.classList.add('editor__span', 'font_regular');
    span.innerText = 'Выберите способ получения денег';
    const chooseArea = document.createElement('div');
    chooseArea.classList.add('editor__choose-area', 'choose-area');
    new Button(chooseArea, {
      viewType: ButtonType.ICON,
      actionType: 'button',
      innerIcon: phoneIcon,
      clickHandler: () => {
        if (this.withdrawType == WithdrawType.PHONE) return;
        this.withdrawType = WithdrawType.PHONE;
        this.input?.remove();
        this.input = new InputField(inputsArea, {
          kind: InputType.PHONE,
          label:
    'Введите телефон, который привязан к QIWI кошельку (комиссия 5%)',
          name: 'phone',
          placeholder: '89001231212',
          displayError: false,
          title: 'Введите номер телефона российского оператора',
        });
      },
    }).addClassNames('choose-area__btn');
    const verticalBorder = document.createElement('div');
    verticalBorder.classList.add('choose-area__vertical-border', 'bg_hr');
    chooseArea.appendChild(verticalBorder);
    new Button(chooseArea, {
      viewType: ButtonType.ICON,
      actionType: 'button',
      innerIcon: cardIcon,
      clickHandler: () => {
        if (this.withdrawType == WithdrawType.CARD) return;
        this.withdrawType = WithdrawType.CARD;
        this.input?.remove();
        this.input = new InputField(inputsArea, {
          kind: InputType.CARD,
          label: 'Введите номер банковской карты (комиссия 5% + 50 руб)',
          name: 'card',
          placeholder: '9999 9999 9999 9999',
          displayError: false,
          title: 'Введите заголовок подписки (не более 30 символов)',
        });
      },
    }).addClassNames('choose-area__btn');
    inputsArea.append(span, chooseArea);
    this.withdrawType = WithdrawType.PHONE;
    this.input = new InputField(inputsArea, {
      kind: InputType.PHONE,
      label: 'Введите телефон, который привязан к QIWI кошельку (комиссия 5%)',
      name: 'phone',
      placeholder: '89001231212',
      displayError: false,
      title: 'Введите номер телефона российского оператора',
    });
  }

  private addButtons(form: HTMLFormElement) {
    const btnArea = querySelectorWithThrow(form, '.editor__btn-area');

    this.submitBtn = new Button(btnArea, {
      viewType: ButtonType.PRIMARY,
      innerText: 'Вывести',
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
