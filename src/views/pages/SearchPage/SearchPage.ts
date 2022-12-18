import searchAuthor, {SearchAuthorForm} from '@actions/handlers/searchAuthor';
import {PayloadUser} from '@actions/types/user';
import store from '@app/Store';
import Button, {ButtonType} from '@components/Button/Button';
import InputField, {InputType} from '@components/InputField/InputField';
import SubscriptionLink from '@components/SubscriptionLink/SubscriptionLink';
import './search-page.styl';
import UpgradeViewBase from '@app/UpgradeView';

export default class SearchPage extends UpgradeViewBase {
  private listArea: HTMLDivElement = document.createElement('div');

  constructor(element: HTMLElement) {
    super();
    this.renderTo(element);
  }

  protected render(): HTMLDivElement {
    const page = document.createElement('div');
    page.classList.add('search-page', 'search-page__back');

    const title = document.createElement('span');
    title.classList.add('search-page__title', 'font_big');
    title.innerText = 'Поиск автора';
    page.appendChild(title);

    const searchForm = document.createElement('form');
    searchForm.classList.add('search-page__search-form');

    const input = new InputField(searchForm, {
      kind: InputType.TEXT,
      label: '',
      name: 'searchField',
      placeholder: 'Введите псевдоним автора',
      displayError: false,
    });
    input.addClassNames('search-page__input-field');
    const btn = new Button(searchForm, {
      viewType: ButtonType.PRIMARY,
      innerText: 'Найти',
      actionType: 'submit',
    });
    btn.addClassNames('search-page__search-btn');
    page.appendChild(searchForm);

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      searchAuthor((e.target as HTMLFormElement).elements as SearchAuthorForm);
    });
    this.listArea.classList.add(
        'search-page__list-area',
        'bg_main',
        'font_regular',
    );

    page.appendChild(this.listArea);

    return page;
  }

  notify(): void {
    const authors = store.getState().authors as PayloadUser[] | undefined;
    if (!authors) {
      this.listArea.innerText =
      `Введите псевдоним интересующего Вас автора.\n
       Или просто нажмите на кнопку "Найти",
       чтобы уведеть всех доступных авторов.`;
      return;
    }
    if (authors.length === 0) {
      this.listArea.innerText =
        'По Вашему запросу ничего не найдено (ｏ・_・)ノ”(ノ_<、)';
      return;
    }
    this.listArea.innerHTML = '';
    authors.forEach((author: PayloadUser) => {
      new SubscriptionLink(this.listArea, {
        id: author.id,
        username: author.username,
        imgPath: author.avatar,
        tier: `${author.countSubscribers ?? 0} донатеров`,
      });
    });
  }

  protected onErase(): void {
    return;
  }
}
