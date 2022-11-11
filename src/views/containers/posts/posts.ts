import {PayloadPost} from '@actions/types/posts';
import {PayloadUser} from '@actions/types/user';
import store from '@app/store';
import {IconButton} from '@components/icon_button/icon_button';
import {Post} from '@components/post/post';
import {IObserver} from '@flux/types/observer';
import plusIcon from '@icon/plus.svg';
import './posts.styl';
import template from './posts.hbs';
import {openPostEditor} from '@actions/handlers/editor';

/** */
export class PostsContaner implements IObserver {
  readonly element: HTMLElement;
  // private postsArea: Element;
  private posts: PayloadPost[] = [];
  /**
   *
   * @param withCreate -
   */
  constructor(withCreate: boolean) {
    this.element = document.createElement('div');
    this.element.className = 'posts-container';
    this.element.innerHTML = template({});
    if (withCreate) {
      // TODO  добавить кнопку создани я постов
      const createPostBtn = new IconButton(plusIcon, 'button');
      createPostBtn.element.addEventListener('click',
          () => {
            // TODO экшен создания поста
            openPostEditor();
          });
      this.element.querySelector('.posts-container__title-area')
          ?.appendChild(createPostBtn.element);
    }
    // this.postsArea =
    //   this.element.getElementsByClassName('posts-container__posts-area')[0];
    store.registerObserver(this);
  }
  /** */
  notify(): void {
    const state = store.getState();
    const postsNew = state.posts as PayloadPost[];

    // if (JSON.stringify(postsNew) !== JSON.stringify(this.posts)) {
    this.posts = postsNew;
    this.setNewPosts(...this.posts);
    // }
  }
  /**
   *
   * @param newPosts -
   */
  private setNewPosts(...newPosts: PayloadPost[]) {
    const el = this.element.querySelector('.posts-container__posts-area');
    if (!el) return;
    el.replaceChildren();
    const postArr: Post[] = [];
    newPosts.forEach(
        (postContext) => {
          const post = new Post(
              postContext,
              (store.getState().user as PayloadUser)
                  .id === postContext.author.id,
          );
          postArr[postContext.postID] = post;
        });
    postArr.reverse().forEach((post) => el.appendChild(post.element));
  }
}
