import './feed-page.styl';
import {getFeed} from '@actions/handlers/posts';
import {PayloadUser} from '@actions/types/user';
import store from '@app/Store';
import PostsContainer from '@views/containers/PostsContainer/PostsContainer';
import UpgradeViewBase from '@app/UpgradeView';

export default class FeedPage extends UpgradeViewBase {
  private postsContainer!: PostsContainer;

  constructor(element: HTMLElement) {
    super();
    this.renderTo(element);
  }
  protected render(): HTMLDivElement {
    const page = document.createElement('div');
    page.classList.add('feed-page', 'feed-page__feed-page');
    const content = document.createElement('div');
    content.classList.add('feed-page__content-area');
    page.appendChild(content);

    const state = store.getState();
    const user = state.user as PayloadUser;

    this.postsContainer = new PostsContainer(content, {
      withCreateBtn: user.isAuthor,
    });

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
