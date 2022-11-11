import {PayloadPost} from '@actions/types/posts';
import store from '@app/store';
import {IObserver} from '@flux/types/observer';
import {IView} from '@flux/types/view';
import {Post} from '@components/post/post';
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
  private posts: PayloadPost[];

  /** Конструктор */
  constructor() {
    const base = document.createElement('div');
    base.classList.add('feed-page');

    const content = document.createElement('div');
    content.classList.add('feed-page__content-area');
    base.appendChild(content);

    const state = store.getState();
    this.posts = state.posts as PayloadPost[];

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
  }
  /** */
  notify(): void {
    const state = store.getState();
    const postsNew = state.posts as PayloadPost[];

    if (JSON.stringify(postsNew) !== JSON.stringify(this.posts)) {
      this.posts = postsNew;
      this.page.children.content.el.replaceChildren();
      this.page.children.content.posts = [];
    }
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
    return this.page.base;
  }
}
