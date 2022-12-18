import {PayloadPost, PayloadPutImage} from '@actions/types/posts';
import store from '@app/Store';
import Post, {ContextType} from '@components/Post/Post';
import plusIcon from '@icon/plus.svg';
import './posts-container.styl';
import template from './posts-container.hbs';
import {querySelectorWithThrow} from '@flux/types/component';
import Button, {ButtonType} from '@components/Button/Button';
import {PayloadUser} from '@actions/types/user';
import UpgradeViewBase from '@app/UpgradeView';
import {EditorType, PayloadEditor} from '@actions/types/editor';

interface PostsContainerOptions {
  withCreateBtn: boolean
  textWhenEmpty: string
}

/** */
export default
class PostsContainer
  extends UpgradeViewBase {
  private postsState = new Map<number, PayloadPost>();
  private posts = new Map<number, Post>();
  private imageState: PayloadPutImage;

  private newPost!: Post;
  editorState!: PayloadEditor;

  constructor(el: HTMLElement, private options: PostsContainerOptions) {
    super();
    this.imageState = store.getState().image as PayloadPutImage;
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
            clickHandler: this.addNewPost.bind(this),
          });
    }
    querySelectorWithThrow(container, '.posts-container__empty')
        .innerText = this.options.textWhenEmpty;
    return container;
  }

  notify(): void {
    const newPostsState = store.getState().posts as Map<number, PayloadPost>;

    if (newPostsState.size == 0) {
      querySelectorWithThrow(this.domElement, '.posts-container__empty')
          .hidden = false;
    } else {
      querySelectorWithThrow(this.domElement, '.posts-container__empty')
          .hidden = true;
    }

    this.postsState.forEach((_, postID) => {
      if (!newPostsState.has(postID)) {
        this.deletePost(postID);
      }
    });
    newPostsState.forEach(
        (postPayload, postID) => {
          if (this.postsState.has(postID)) {
            this.posts.get(postID)?.update({
              contextType: ContextType.RUNTIME_POST_UPDATE,
              inEditState: false,
              isLiked: postPayload.isLiked,
              likesNum: postPayload.likesNum,
              content: postPayload.content,
              isAllowed: postPayload.isAllowed,
              tier: postPayload.tier,
            });
          } else {
            this.addPost(postPayload);
          }
        },
    );
    this.postsState = new Map(newPostsState);

    const imageNew = (store.getState().image as PayloadPutImage);
    if (imageNew.url.length !== 0 &&
      imageNew.url !== this.imageState.url) {
      this.imageState = imageNew;
      // TODO: add image to post
      if (imageNew.postID !== -1) {
        this.posts.get(imageNew.postID)?.update({
          contextType: ContextType.EDIT_POST_UPDATE,
          inEditState: true,
          url: imageNew.url,
        });
      } else {
        this.newPost.update({
          contextType: ContextType.EDIT_POST_UPDATE,
          inEditState: true,
          url: imageNew.url,
        });
      }
    }
    const editorStateNew = store.getState().editor as PayloadEditor;
    if (JSON.stringify(editorStateNew) !== JSON.stringify(this.editorState)) {
      this.editorState = editorStateNew;
      switch (this.editorState.type) {
        case EditorType.POST:
          this.posts.get(this.editorState.id)?.update({
            contextType: ContextType.CHANGE_EDIT_STATE,
            NewEditState: true,
          });
          break;
        case EditorType.CLOSE_POST:
          this.deletePost(-1);
          this.posts.get(this.editorState.id)?.update({
            contextType: ContextType.CHANGE_EDIT_STATE,
            NewEditState: false,
          });
          break;
        default:
          break;
      }
    }
  }

  protected onErase(): void {
    this.posts.forEach((post) => post.remove());
    this.posts.clear();
  }

  private deletePost(postID: number) {
    this.posts.get(postID)?.remove();
    this.posts.delete(postID);
    this.postsState.delete(postID);
  }

  private addPost(postPayload: PayloadPost) {
    const postsArea = querySelectorWithThrow(
        this.domElement,
        '.posts-container__posts-area',
    );
    this.posts.set(postPayload.postID, new Post(postsArea, {
      ...postPayload,
      changable: postPayload.author.userID ===
        (store.getState().user as PayloadUser).id,
      inEditState: false,
    }));
  }

  private addNewPost() {
    this.deletePost(-1);
    const postsArea = querySelectorWithThrow(
        this.domElement,
        '.posts-container__posts-area',
    );
    const user = store.getState().user as PayloadUser;
    this.posts.set(-1, new Post(postsArea, {
      author: {
        imgPath: user.avatar,
        userID: user.id,
        username: user.username,
      },
      inEditState: true,
      changable: true,
      isAllowed: true,
      isLiked: false,
      likesNum: 0,
      postID: -1,
      tier: 0,
      commentsNum: 0,
      content: '',
      dateCreated: '',
    }));
    // const user = store.getState().user as PayloadUser;
    // this.newPost = new Post(postsArea, {
    //   author: {
    //     imgPath: user.avatar,
    //     userID: user.id,
    //     username: user.username,
    //   },
    //   inEditState: true,
    //   changable: true,
    //   isAllowed: true,
    //   isLiked: false,
    //   likesNum: 0,
    //   postID: -1,
    //   tier: 0,
    //   commentsNum: 0,
    //   content: '',
    //   dateCreated: '',
    // });
  }
}
