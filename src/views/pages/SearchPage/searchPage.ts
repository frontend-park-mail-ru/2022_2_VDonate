import searchAuthor, {SearchAuthorForm} from '@actions/handlers/searchAuthor';
import {PayloadUser} from '@actions/types/user';
import store from '@app/store';
import ViewBaseExtended from '@app/view';
import Button, {ButtonType} from '@components/Button/Button';
import {Glass, GlassType} from '@components/glass/glass';
import InputField, {InputType} from '@components/InputField/InputField';
import SubscriptionLink from '@components/SubscriptionLink/SubscriptionLink';
import './search-page.styl';

export default class SearchPage extends ViewBaseExtended<never> {
  private glass: Glass = new Glass(GlassType.mono);

  constructor(element: HTMLElement) {
    super();
    this.renderTo(element);
  }

  protected render(): HTMLDivElement {
    const page = document.createElement('div');
    page.classList.add('search-page', 'search-page__search-page');

    const searchForm = document.createElement('form');
    searchForm.classList.add('search-page__search-form');

    new InputField(searchForm, {
      kind: InputType.text,
      label: 'Поиск Авторов',
      name: 'searchField',
    });
    new Button(searchForm, {
      viewType: ButtonType.PRIMARY,
      innerText: 'Найти',
      actionType: 'submit',
    });
    page.appendChild(searchForm);

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      searchAuthor((e.target as HTMLFormElement).elements as SearchAuthorForm);
    });
    this.glass.element.classList.add('search-page__glass');
    this.glass.element.innerText = 'Введите имя автора';
    page.appendChild(this.glass.element);

    return page;
  }

  update(data: never): void {
    return data;
  }

  notify(): void {
    const authors = store.getState().authors as PayloadUser[];
    if (!authors.length) {
      this.glass.element.innerText = `Автор не найден`;
      return;
    }
    authors.forEach((author: PayloadUser) => {
      new SubscriptionLink(this.glass.element, {
        id: author.id,
        username: author.username,
        imgPath: author.avatar,
        tier: `донатеров ${author.countSubscribers ?? 0}`,
      });
    });
  }
}
