import {EditorType, PayloadEditor} from '@actions/types/editor';
import {PayloadPost} from '@actions/types/posts';
import {PayloadEditUserErrors, PayloadUser} from '@actions/types/user';
import store from '@app/store';
import PostEditor from '@components/editor/postEditor';
import ProfileEditor from '@components/editor/profileEditor';
import SubscriptionEditor from '@components/editor/subscriptionEditor';

/** */
export class EditorContainer {
  readonly element: HTMLElement;
  private currentEditor?:
    | PostEditor
    | ProfileEditor
    | SubscriptionEditor;
  /** */
  constructor() {
    this.element = document.createElement('editor');
  }
  /**
   *
   * @param editorData -
   */
  displayEditor(editorData: PayloadEditor) {
    switch (editorData.type) {
      case undefined:
        this.element.replaceChildren();
        this.currentEditor = undefined;
        break;
      case EditorType.POST: {
        const postID = editorData.id;
        const targetPost = (store.getState().posts as PayloadPost[]).find(
            (post) => postID === post.postID,
        );
        if (targetPost) {
          this.currentEditor = new PostEditor({
            title: targetPost.title,
            text: targetPost.text,
          });
        }
        break;
      }
      case EditorType.PROFILE: {
        const user = store.getState().user as PayloadUser;
        this.currentEditor = new ProfileEditor({
          id: user.id,
          username: user.username,
          email: user.email,
          isAuthor: user.isAuthor,
          about: user.about,
        });
        break;
      }
      case EditorType.SUBSCRIBTION: {
      // TODO редактирование подписок
        break;
      }
      default:
        break;
    }
    if (this.currentEditor) {
      this.element.appendChild(this.currentEditor.element);
    }
  }
  /**
   *
   * @param errors -
   */
  displayErrors(errors: PayloadEditUserErrors) {
    if (this.currentEditor instanceof ProfileEditor) {
      this.currentEditor.errorDisplay(errors);
    } else {
      console.warn(`Вызов displayErrors в конейнере эдиторов, 
      но текущий эдитор не для постов`);
    }
  }
}
