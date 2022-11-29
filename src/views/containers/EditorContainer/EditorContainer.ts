import {EditorType, PayloadEditor} from '@actions/types/editor';
import {FormErrorType, PayloadFormError} from '@actions/types/formError';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import {PayloadPost} from '@actions/types/posts';
import {PayloadUser} from '@actions/types/user';
import store from '@app/store';
import ViewBaseExtended from '@app/view';
import PostEditor from '@components/Editor/PostEditor';
import ProfileEditor from '@components/Editor/ProfileEditor';
import SubscriptionEditor from '@components/Editor/SubscriptionEditor';

interface EditorUpdateData {
  newEditor?: PayloadEditor
  errors?: PayloadFormError
}

/** */
export default
class EditorContainer
  extends ViewBaseExtended<EditorUpdateData> {
  private editorState: PayloadEditor;
  private currentEditor?:
    | PostEditor
    | ProfileEditor
    | SubscriptionEditor;

  constructor(el: HTMLElement) {
    super();
    this.renderTo(el);
    this.editorState = store.getState().editor as PayloadEditor;
    this.update({
      newEditor: this.editorState,
    });
  }

  protected render(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'editor-container';

    return container;
  }

  notify(): void {
    const editorStateNew = store.getState().editor as PayloadEditor;
    if (this.editorState.type && editorStateNew.type) {
      this.editorState = editorStateNew;
      this.update({
        newEditor: this.editorState,
      });
    }

    if (JSON.stringify(editorStateNew) !== JSON.stringify(this.editorState)) {
      this.editorState = editorStateNew;
      this.update({
        newEditor: this.editorState,
      });
    }
  }

  update(data: EditorUpdateData): void {
    if (data.newEditor) this.displayEditor(data.newEditor);
    if (data.errors) this.displayErrors(data.errors);
  }

  private displayEditor(newEditor: PayloadEditor) {
    switch (newEditor.type) {
      case undefined:
        this.currentEditor?.remove();
        this.currentEditor = undefined;
        break;
      case EditorType.POST: {
        const postID = newEditor.id;
        if (!postID) {
          this.currentEditor = new PostEditor(this.domElement);
          break;
        }
        const targetPost = (store.getState().posts as PayloadPost[]).find(
            (post) => postID === post.postID,
        );
        if (targetPost) {
          this.currentEditor = new PostEditor(this.domElement,
              {
                id: postID,
                title: targetPost.content.title,
                text: targetPost.content.text,
              });
        }
        break;
      }
      case EditorType.PROFILE: {
        const user = store.getState().user as PayloadUser;
        this.currentEditor = new ProfileEditor(this.domElement,
            {
              id: user.id,
              username: user.username,
              email: user.email,
              isAuthor: user.isAuthor,
              about: user.about,
            });
        break;
      }
      case EditorType.SUBSCRIBTION: {
        const subID = newEditor.id;
        if (!subID) {
          this.currentEditor = new SubscriptionEditor(this.domElement);
          break;
        }
        const subs = (
          store.getState().profile as PayloadGetProfileData
        ).authorSubscriptions;
        if (subs && typeof subs != 'string') {
          const targetSub = subs.find((sub) => subID === sub.id);
          if (targetSub) {
            this.currentEditor = new SubscriptionEditor(this.domElement,
                {
                  id: subID,
                  title: targetSub.title,
                  price: targetSub.price,
                  tier: targetSub.tier,
                  text: targetSub.text,
                });
          }
        }
        break;
      }
      default: {
        const _: never = newEditor;
        return _;
      }
    }
  }

  private displayErrors(errors: PayloadFormError) {
    if (this.currentEditor instanceof ProfileEditor &&
      errors?.type == FormErrorType.EDIT_USER) {
      this.currentEditor.update({
        username: errors.username ? true : undefined,
        email: errors.email ? true : undefined,
        password: errors.password ? true : undefined,
        repeatPassword: errors.repeatPassword ? true : undefined,
        about: errors.about ? true : undefined,
      });
    } else if (this.currentEditor instanceof SubscriptionEditor &&
      errors?.type == FormErrorType.AUTHOR_SUBSCRIPTION) {
      this.currentEditor.update({
        price: errors.price ? true : undefined,
        title: errors.title ? true : undefined,
        text: errors.text ? true : undefined,
        tier: errors.tier ? true : undefined,
      });
    } else {
      throw new Error(`displayErrors вызван с разногласиями в типе ошибок 
      и типе редактора`);
    }
  }
}
