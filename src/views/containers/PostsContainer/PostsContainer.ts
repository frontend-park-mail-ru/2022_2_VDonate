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
import {closeEditor, createNewPost} from '@actions/handlers/editor';
import {PayloadComment} from '@actions/types/comments';

interface PostsContainerOptions {
  withCreateBtn: boolean
  textWhenEmpty: string
}

interface CommentState {
  postID: number
  commentMap?: Map<number, PayloadComment>
  commentID?: number
  comment?: PayloadComment
}
/** */
export default
class PostsContainer
  extends UpgradeViewBase {
  private postsState = new Map<number, PayloadPost>();
  private posts = new Map<number, Post>();
  private imageState: PayloadPutImage;
  private commentState!: CommentState;
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
            clickHandler: () => {
              if (this.posts.get(-1)) {
                closeEditor(-1);
              } else {
                createNewPost();
              }
            },
          });
    }
    querySelectorWithThrow(container, '.posts-container__empty')
        .innerText = this.options.textWhenEmpty;
    return container;
  }

  notify(): void {
    const newPostsState = store.getState().posts as Map<number, PayloadPost>;

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
              commentsNum: postPayload.commentsNum,
              content: postPayload.content,
              isAllowed: postPayload.isAllowed,
              tier: postPayload.tier,
            });
          } else {
            this.deletePost(-1);
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
        this.posts.get(-1)?.update({
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
          if (this.editorState.id == -1) {
            this.addNewPost();
          } else {
            this.posts.get(this.editorState.id)?.update({
              contextType: ContextType.CHANGE_EDIT_STATE,
              NewEditState: true,
            });
          }
          break;
        case EditorType.CLOSE_POST:
          if (this.editorState.id == -1) {
            this.deletePost(-1);
          } else {
            this.posts.get(this.editorState.id)?.update({
              contextType: ContextType.CHANGE_EDIT_STATE,
              NewEditState: false,
            });
          }
          break;
        default:
          break;
      }
    }
    const newCommentsState =
      store.getState().comments as CommentState;
    if (JSON.stringify(newCommentsState) !==
        JSON.stringify(this.commentState)) {
      this.commentState = newCommentsState;
      this.posts.get(this.commentState.postID)?.update({
        contextType: ContextType.COMMENTS,
        ...this.commentState,
      });
    }
    if (newPostsState.size == 0 && !this.posts.get(-1)) {
      querySelectorWithThrow(this.domElement, '.posts-container__empty')
          .hidden = false;
    } else {
      querySelectorWithThrow(this.domElement, '.posts-container__empty')
          .hidden = true;
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
      changeable: postPayload.author.userID ===
        (store.getState().user as PayloadUser).id,
      inEditState: false,
      commentsOpened: false,
    }));
  }

  private addNewPost() {
    if (this.posts.get(-1)) return;
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
      content: '',
      dateCreated: '',
      isAllowed: true,
      isLiked: false,
      likesNum: 0,
      postID: -1,
      tier: 0,
      commentsNum: 0,
      inEditState: true,
      changeable: true,
      commentsOpened: false,
    }));
  }
}
