import {getPosts} from '@actions/handlers/posts';
import {PayloadPost} from '@actions/types/posts';
import store from '@app/store';
import {IObserver} from '@flux/types/observer';
import {IView} from '@flux/types/view';
import {Post} from '@models/post/post';
import avatar from '@img/2.jpg';
import './feedPage.styl';
/** Тип структорного представления страницы из компонентов */
interface FeedModel {
  base: HTMLDivElement
  children: {
    content: {
      el: HTMLDivElement
      posts: Post[]
    }
  }
}
/** Класс */
export default class FeedPage implements IObserver, IView {
  private page: FeedModel;
  private posts: PayloadPost[] | undefined;
  /** Конструктор */
  constructor() {
    const base = document.createElement('div');
    base.classList.add('feed-page');

    const content = document.createElement('div');
    content.classList.add('feed-page__content-area');
    base.appendChild(content);

    this.posts = store.getState().posts as PayloadPost[];
    this.page = {
      base,
      children: {
        content: {
          el: content,
          posts: [],
        },
      },
    };
    store.registerObserver(this);
    getPosts(1);
  }
  /** */
  notify(): void {
    this.posts = store.getState().posts as PayloadPost[];
    console.log(this.posts);
    this.rerender();
  }
  /** */
  reset(): void {
    store.removeObserver(this);
    this.page.base.remove();
  }
  /**
   *
   * @returns dfd
   */
  render(): HTMLElement {
    this.rerender();
    return this.page.base;
  }
  /** */
  rerender(): void {
    this.page.children.content.el.replaceChildren();
    this.page.children.content.posts = [];
    if (this.posts) {
      this.posts.forEach(
          (postContext) => {
            const post = new Post(
                {
                  author: {
                    id: postContext.user_id,
                    img: avatar,
                    username: 'OnePunchMan',
                  },
                  commentCount: 10,
                  content: postContext.text,
                  date: new Date(Date.now()),
                  isLikedByMe: false,
                  likeCount: 5,
                  postID: postContext.id,
                },
            );
            this.page.children.content.posts.push(post);
            this.page.children.content.el.appendChild(post.element);
          },
      );
      this.posts.forEach(
          (postContext) => {
            const post = new Post(
                {
                  author: {
                    id: postContext.user_id,
                    img: avatar,
                    username: 'OnePunchMan',
                  },
                  commentCount: 10,
                  content: postContext.text,
                  date: new Date(Date.now()),
                  isLikedByMe: false,
                  likeCount: 5,
                  postID: postContext.id,
                },
            );
            this.page.children.content.posts.push(post);
            this.page.children.content.el.appendChild(post.element);
          },
      );
    }
  }
}
