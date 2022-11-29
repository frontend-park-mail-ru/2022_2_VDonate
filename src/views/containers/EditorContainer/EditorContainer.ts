import {EditorType, PayloadEditor} from '@actions/types/editor';
import {FormErrorType, PayloadFormError} from '@actions/types/formError';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import {PayloadPost} from '@actions/types/posts';
import {PayloadUser} from '@actions/types/user';
import store from '@app/Store';
import PostEditor from '@components/Editor/PostEditor';
import ProfileEditor from '@components/Editor/ProfileEditor';
import SubscriptionEditor from '@components/Editor/SubscriptionEditor';
import {querySelectorWithThrow} from '@flux/types/component';
import ContainerBase from '@app/Container';

interface EditorUpdateData {
  newEditor?: PayloadEditor
  errors?: PayloadFormError
  image?: string
}

/** */
export default
class EditorContainer
  extends ContainerBase<EditorUpdateData> {
  private editorState: PayloadEditor;
  private formErrorsState: PayloadFormError;
  private currentEditor?:
    | PostEditor
    | ProfileEditor
    | SubscriptionEditor;
  private editorType!: EditorType;

  constructor(el: HTMLElement) {
    super();
    this.editorState = store.getState().editor as PayloadEditor;
    this.formErrorsState = store.getState().formErrors as PayloadFormError;
    this.renderTo(el);
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
    const state = store.getState();

    const editorStateNew = state.editor as PayloadEditor;
    // if (this.editorState.type && editorStateNew.type) {
    //   this.editorState = editorStateNew;
    //   this.update({
    //     newEditor: this.editorState,
    //   });
    // }

    if (JSON.stringify(editorStateNew) !== JSON.stringify(this.editorState)) {
      this.editorState = editorStateNew;
      this.update({
        newEditor: this.editorState,
      });
    }
    if (this.editorType == EditorType.POST) {
      const url = (store.getState().image as {url: string} | undefined)?.url;
      if (url) {
        this.update({image: url});
      }
    }
    const formErrorsNew = state.formErrors as PayloadFormError;
    if (JSON.stringify(formErrorsNew) !==
      JSON.stringify(this.formErrorsState)) {
      this.formErrorsState = formErrorsNew;
      this.update({
        errors: this.formErrorsState,
      });
    }
  }

  update(data: EditorUpdateData): void {
    if (data.newEditor) this.displayEditor(data.newEditor);
    if (data.errors) this.displayErrors(data.errors);
    if (data.image) this.addImage(data.image);
  }

  private addImage(image: string) {
    if (this.editorType == EditorType.POST) {
      const textarea = querySelectorWithThrow(
          this.domElement,
          'textarea.input-field__textarea',
      ) as HTMLInputElement;
      textarea.value += `[img|${image}]`;
    }
  }

  private displayEditor(newEditor: PayloadEditor) {
    switch (newEditor.type) {
      case undefined:
        this.currentEditor?.remove();
        this.currentEditor = undefined;
        break;
      case EditorType.POST: {
        this.editorType = EditorType.POST;
        const postID = newEditor.id;
        if (typeof postID !== 'number') {
          this.currentEditor = new PostEditor(this.domElement);
          break;
        }
        const postsStore = store.getState().posts as Map<number, PayloadPost>;
        const targetPost = postsStore.get(postID);
        if (targetPost) {
          this.currentEditor = new PostEditor(this.domElement,
              {
                id: postID,
                text: targetPost.content,
                tier: targetPost.tier,
              });
        }
        break;
      }
      case EditorType.PROFILE: {
        this.editorType = EditorType.PROFILE;
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
        this.editorType = EditorType.SUBSCRIBTION;
        const subID = newEditor.id;
        if (typeof subID !== 'number') {
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
    switch (errors?.type) {
      case FormErrorType.EDIT_USER:
        if (this.currentEditor instanceof ProfileEditor) {
          this.currentEditor.update({
            username: errors.username ? true : undefined,
            email: errors.email ? true : undefined,
            password: errors.password ? true : undefined,
            repeatPassword: errors.repeatPassword ? true : undefined,
            about: errors.about ? true : undefined,
          });
        }
        break;
      case FormErrorType.AUTHOR_SUBSCRIPTION:
        if (this.currentEditor instanceof SubscriptionEditor) {
          this.currentEditor.update({
            price: errors.price ? true : undefined,
            title: errors.title ? true : undefined,
            text: errors.text ? true : undefined,
            tier: errors.tier ? true : undefined,
          });
        }
        break;
      default:
        break;
    }
  }
}
