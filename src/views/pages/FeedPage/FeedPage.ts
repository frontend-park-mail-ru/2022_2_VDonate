import './feed-page.styl';
import {getFeed} from '@actions/handlers/posts';
import {PayloadUser} from '@actions/types/user';
import store from '@app/Store';
import PostsContainer from '@views/containers/PostsContainer/PostsContainer';
import UpgradeViewBase from '@app/UpgradeView';
import {querySelectorWithThrow} from '@flux/types/component';
import Button, {ButtonType} from '@components/Button/Button';
import routing from '@actions/handlers/routing';

export default class FeedPage extends UpgradeViewBase {
  private postsContainer!: PostsContainer;

  constructor(element: HTMLElement) {
    super();
    this.renderTo(element);
  }
  protected render(): HTMLDivElement {
    const page = document.createElement('div');
    page.classList.add('feed-page', 'feed-page__back');

    const state = store.getState();
    const user = state.user as PayloadUser;

    this.postsContainer = new PostsContainer(page, {
      withCreateBtn: user.isAuthor,
      textWhenEmpty:
      'Предлагаем вам перейти в поиск и найти своего первого автора.',
    });
    this.postsContainer.addClassNames('feed-page__content-area');
    const goToSearchArea =
      querySelectorWithThrow(page, '.posts-container__empty');
    new Button(goToSearchArea, {
      actionType: 'button',
      viewType: ButtonType.OUTLINE,
      innerText: 'Перейти в поиск',
      clickHandler: () => routing('/search'),
    }).addClassNames('feed-page__search-btn');

    getFeed();
    return page;
  }

  protected onErase(): void {
    this.postsContainer.erase();
  }

  notify(): void {
    return;
  }
}
