import {PayloadPost} from '@actions/types/posts';
import store from '@app/store';
import Post from '@components/Post/Post';
import plusIcon from '@icon/plus.svg';
import './posts-container.styl';
import template from './posts-container.hbs';
import {openPostEditor} from '@actions/handlers/editor';
import {querySelectorWithThrow} from '@flux/types/component';
import Button, {ButtonType} from '@components/Button/Button';
import ViewBaseExtended from '@app/view';
import specialCompare from '@specialCompare/specialCompare';

interface PostsContainerOptions {
  withCreateBtn: boolean
}

/** */
export default
class PostsContainer
  extends ViewBaseExtended<Map<number, PayloadPost>> {
  private postsState = new Map<number, PayloadPost>();
  private posts = new Map<number, Post>();

  constructor(el: HTMLElement, private options: PostsContainerOptions) {
    super();
    this.renderTo(el);
    this.notify();
  }

  protected render(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'posts-container';
    container.innerHTML = template({});
    if (this.options.withCreateBtn) {
      new Button(
          querySelectorWithThrow(container, '.posts-container__title-area'),
          {
            viewType: ButtonType.ICON,
            actionType: 'button',
            innerIcon: plusIcon,
            clickCallback: openPostEditor,
          });
    }
    return container;
  }

  notify(): void {
    this.update(store.getState().posts as Map<number, PayloadPost>);
  }

  update(newPostsState: Map<number, PayloadPost>): void {
    this.postsState.forEach((_, postID) => {
      if (!newPostsState.has(postID)) {
        this.deletePost(postID);
      }
    });
    console.log(newPostsState);
    console.log(this.postsState);
    newPostsState.forEach(
        (postPayload, postID) => {
          const oldPost = this.postsState.get(postID);
          if (oldPost) {
            this.posts.get(postID)?.update({
              isLiked: specialCompare(oldPost.isLiked, postPayload.isLiked),
              content: specialCompare(oldPost.content, postPayload.content),
            });
          } else {
            this.addPost(postPayload);
          }
        },
    );

    this.postsState = new Map(newPostsState);
  }

  private deletePost(postID: number) {
    this.posts.get(postID)?.remove();
    this.posts.delete(postID);
  }

  private addPost(postPayload: PayloadPost) {
    const postsArea = querySelectorWithThrow(
        this.domElement,
        '.posts-container__posts-area',
    );
    console.log(postPayload);
    this.posts.set(postPayload.postID, new Post(postsArea, {
      ...postPayload,
      changable: postPayload.userID == postPayload.author.userID,
    }));
  }
}
