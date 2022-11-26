import {PayloadPost} from '@actions/types/posts';
import {PayloadUser} from '@actions/types/user';
import store from '@app/store';
import Post from '@components/Post/Post';
import plusIcon from '@icon/plus.svg';
import './posts.styl';
import template from './posts.hbs';
import {openPostEditor} from '@actions/handlers/editor';
import {querySelectorWithThrow} from '@flux/types/component';
import Button, {ButtonType} from '@components/Button/Button';
import ViewBaseExtended from '@app/view';

interface PostsContainerOptions {
  withCreateBtn: boolean
}
type PostsUpdateData = (PayloadPost & { isDelete?: true })[];
/** */
export default
class PostsContainer
  extends ViewBaseExtended<PostsUpdateData> {
  private postsState?: PayloadPost[];
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
            viewType: ButtonType.icon,
            actionType: 'button',
            innerIcon: plusIcon,
            clickCallback: openPostEditor,
          });
    }
    return container;
  }

  notify(): void {
    const postsNew = store.getState().posts as PayloadPost[];

    // if (JSON.stringify(postsNew) !== JSON.stringify(this.posts)) {
    this.postsState = postsNew;
    this.update(this.postsState);
    // }
  }

  update(newPosts: PostsUpdateData): void {
    const postsArea = querySelectorWithThrow(
        this.domElement,
        '.posts-container__posts-area',
    );

    newPosts.forEach(
        (postContext) => {
          if (this.posts.has(postContext.postID)) {
            if (postContext.isDelete) {
              this.posts.get(postContext.postID)?.remove();
              this.posts.delete(postContext.postID);
            } else {
              this.posts.get(postContext.postID)?.update(postContext);
            }
          } else {
            this.posts.set(postContext.postID, new Post(
                postsArea,
                {
                  ...postContext,
                  changable: (store.getState().user as PayloadUser)
                      .id === postContext.author.id,
                },
            ));
          }
        });
  }
}
