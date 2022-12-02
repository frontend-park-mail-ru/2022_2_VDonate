// import store from '@app/Store';
// import {IView} from '@flux/types/view';
// import './feedPage.styl';
// import {PostsContaner} from '@views/containers/posts/posts';
// import {PayloadUser} from '@actions/types/user';
// import {getFeed} from '@actions/handlers/posts';
// /** Тип структорного представления страницы из компонентов */
// interface FeedModel {
//   el: HTMLDivElement
//   content: {
//     el: HTMLDivElement
//     posts: PostsContaner
//   }
// }
// /** Класс */
// export default class FeedPage implements IView {
//   private page: FeedModel;
// FIXME Доделать
//   /** Конструктор */
//   constructor() {
//     const el = document.createElement('div');
//     el.classList.add('feed-page');

//     const content = document.createElement('div');
//     content.classList.add('feed-page__content-area');
//     el.appendChild(content);

//     const state = store.getState();
//     const user = state.user as PayloadUser;

//     const posts = new PostsContaner(user.isAuthor);
//     content.appendChild(posts.element);

//     this.page = {
//       el,
//       content: {
//         el: content,
//         posts,
//       },
//     };

//     getFeed();
//   }
//   /** */
//   reset(): void {
//     this.page.el.remove();
//   }
//   /**
//    *
//    * @returns dfd
//    */
//   render(): HTMLElement {
//     return this.page.el;
//   }
// }
import './feed-page.styl';
import {getFeed} from '@actions/handlers/posts';
import {PayloadUser} from '@actions/types/user';
import store from '@app/Store';
import PostsContainer from '@views/containers/PostsContainer/PostsContainer';
import PageBase from '@app/Page';

export default class FeedPage extends PageBase {
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
