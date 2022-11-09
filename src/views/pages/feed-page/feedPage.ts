import {getPosts} from '@actions/handlers/posts';
import {PayloadPost} from '@actions/types/posts';
import store from '@app/store';
import {IObserver} from '@flux/types/observer';
import {IView} from '@flux/types/view';
import {Post} from '@models/post/post';
import './feedPage.styl';
// Временно
import avatar from '@img/2.jpg';
import {PayloadPostEditor} from '@actions/types/editor';
import Editor, {EditorTitle} from '@models/editor/editor';
/** Тип структорного представления страницы из компонентов */
interface FeedModel {
  base: HTMLDivElement
  children: {
    content: {
      el: HTMLDivElement
      posts: Post[]
    }
    editor?: Editor
  }
}
/** Класс */
export default class FeedPage implements IObserver, IView {
  private page: FeedModel;
  private posts: PayloadPost[];
  private postEditor: PayloadPostEditor;
  /** Конструктор */
  constructor() {
    const base = document.createElement('div');
    base.classList.add('feed-page');

    const content = document.createElement('div');
    content.classList.add('feed-page__content-area');
    base.appendChild(content);

    const state = store.getState();
    this.posts = state.posts as PayloadPost[];
    this.postEditor = state.postEditor as PayloadPostEditor;
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
    getPosts(4);
  }
  /** */
  notify(): void {
    const state = store.getState();
    const postsNew = state.posts as PayloadPost[];
    const postEditorNew = state.postEditor as PayloadPostEditor;
    if (JSON.stringify(postsNew) !== JSON.stringify(this.posts)) {
      this.posts = postsNew;
      this.rerender();
    }
    if (JSON.stringify(postEditorNew) !== JSON.stringify(this.postEditor)) {
      this.postEditor = postEditorNew;
      if (this.postEditor.id) {
        const targetPost = this.posts.find(
            (post: PayloadPost) => this.postEditor.id === post.postID,
        );
        if (targetPost) {
          this.page.children.editor = new Editor({
            editorTitle: EditorTitle.POST,
            title: targetPost.title,
            text: targetPost.text,
          });
          this.page.base.appendChild(this.page.children.editor.element);
        }
      } else {
        this.page.children.editor?.element.remove();
        this.page.children.editor = undefined;
      }
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
    this.rerender();
    return this.page.base;
  }
  /** */
  rerender(): void {
    this.page.children.content.el.replaceChildren();
    this.page.children.content.posts = [];
    this.posts.forEach(
        (postContext) => {
          const post = new Post(
              {
                author: {
                  id: postContext.userID,
                  img: avatar,
                  username: 'OnePunchMan',
                },
                commentCount: 10,
                content: {
                  title: postContext.title,
                  img: postContext.img,
                  text: postContext.text,
                },
                date: new Date(Date.now()),
                isLikedByMe: false,
                likeCount: 5,
                postID: postContext.postID,
                changable: true,
              },
          );
          this.page.children.content.posts.push(post);
          this.page.children.content.el.appendChild(post.element);
        },
    );
  }
}
