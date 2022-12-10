import {EditorType, PayloadEditor} from '@actions/types/editor';
import {FormErrorType, PayloadFormError} from '@actions/types/formError';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import {PayloadUser} from '@actions/types/user';
import store from '@app/Store';
import ProfileEditor from '@components/Editor/ProfileEditor';
import SubscriptionEditor from '@components/Editor/SubscriptionEditor';
import PayEditor from '@components/Editor/PayEditor';
import UpgradeViewBase from '@app/UpgradeView';
import './editor-container.styl';

/** */
export default
class EditorContainer
  extends UpgradeViewBase {
  private editorState: PayloadEditor;
  private formErrorsState: PayloadFormError;
  private currentEditor?:
    | ProfileEditor
    | SubscriptionEditor
    | PayEditor;
  private editorType!: EditorType;

  private imageState: {
    url: string,
  };

  constructor(el: HTMLElement) {
    super();
    this.editorState = store.getState().editor as PayloadEditor;
    this.formErrorsState = store.getState().formErrors as PayloadFormError;
    this.imageState = store.getState().image as { url: string };
    this.renderTo(el);
    this.displayEditor(this.editorState);
  }

  protected render(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'editor-container';

    return container;
  }

  notify(): void {
    const state = store.getState();

    const editorStateNew = state.editor as PayloadEditor;

    if (JSON.stringify(editorStateNew) !== JSON.stringify(this.editorState)) {
      this.editorState = editorStateNew;
      this.displayEditor(editorStateNew);
    }

    const formErrorsNew = state.formErrors as PayloadFormError;
    if (JSON.stringify(formErrorsNew) !==
      JSON.stringify(this.formErrorsState)) {
      this.formErrorsState = formErrorsNew;
      this.displayErrors(this.formErrorsState);
    }
  }

  protected onErase(): void {
    this.currentEditor?.remove();
  }

  private displayEditor(newEditor: PayloadEditor) {
    switch (newEditor.type) {
      case undefined:
        this.currentEditor?.remove();
        this.currentEditor = undefined;
        break;
      case EditorType.PROFILE: {
        this.editorType = EditorType.PROFILE;
        const user = store.getState().user as PayloadUser;
        this.currentEditor = new ProfileEditor(this.domElement,
            {
              id: user.id,
              username: user.username,
              email: user.email,
            });
        break;
      }
      case EditorType.SUBSCRIBTION: {
        this.editorType = EditorType.SUBSCRIBTION;
        if (typeof newEditor.id !== 'number') {
          this.currentEditor = new SubscriptionEditor(this.domElement);
          break;
        }
        const subs = (
          store.getState().profile as PayloadGetProfileData
        ).authorSubscriptions;
        if (subs && typeof subs != 'string') {
          const targetSub = subs.find((sub) => newEditor.id === sub.id);
          if (targetSub) {
            this.currentEditor = new SubscriptionEditor(this.domElement,
                {
                  id: newEditor.id,
                  title: targetSub.title,
                  price: targetSub.price,
                  tier: targetSub.tier,
                  text: targetSub.text,
                });
          }
        }
        break;
      }
      case EditorType.PAY:
        this.editorType = EditorType.PAY;
        this.currentEditor = new PayEditor(this.domElement, {
          authorID: newEditor.authorID,
          authorSubscriptionID: newEditor.authorSubscriptionID,
          currentCardStatus: newEditor.currentCardStatus,
        });
        break;
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
            username: Boolean(errors.username),
            email: Boolean(errors.email),
            password: Boolean(errors.password),
            repeatPassword: Boolean(errors.repeatPassword),
          });
        }
        break;
      case FormErrorType.AUTHOR_SUBSCRIPTION:
        if (this.currentEditor instanceof SubscriptionEditor) {
          this.currentEditor.update({
            price: Boolean(errors.price),
            title: Boolean(errors.title),
            text: Boolean(errors.text),
            tier: Boolean(errors.tier),
          });
        }
        break;
      default:
        break;
    }
  }
}
