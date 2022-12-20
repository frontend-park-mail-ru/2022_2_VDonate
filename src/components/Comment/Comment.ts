import Avatar, {AvatarType} from '@components/Avatar/Avatar';
import {PayloadComment} from '@actions/types/comments';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import './comment.styl';
import {PayloadUser} from '@actions/types/user';
import store from '@app/Store';
import Button, {ButtonType} from '@components/Button/Button';
import closeIcon from '@icon/close.svg';
// import editIcon from '@icon/edit.svg';
import {notice} from '@actions/handlers/notice';
import {deleteComment, updateComment} from '@actions/handlers/comments';
import {commentSize} from '@validation/validation';

type CommentOptions = PayloadComment & {
  inEditState: boolean,
  postID: number,
}

export default
class Comment extends ComponentBase<'div', string> {
  constructor(el: HTMLElement, private options: CommentOptions) {
    super();
    this.renderTo(el);
  }

  update(data: string): void {
    querySelectorWithThrow(this.domElement, 'comment__text')
        .innerText = data;
  }

  protected render(): HTMLDivElement {
    const comment = document.createElement('div');
    comment.classList.add('comment');
    new Avatar(comment, {
      imgPath: this.options.userImg,
      viewType: this.options.authorID == this.options.userID ?
          AvatarType.AUTHOR : AvatarType.DONATER,
    }).addClassNames('comment__avatar');
    const commentArea = document.createElement('div');
    commentArea.classList.add('comment__area');
    const username = document.createElement('a');
    username.setAttribute('data-link', '');
    username.setAttribute('href', `/profile?id=${this.options.userID}`);
    username.classList.add('comment__username', 'font_regular');
    username.innerText = this.options.username;
    const text = document.createElement('div');
    text.classList.add('comment__text', 'font_regular');
    text.innerText = this.options.content;
    commentArea.append(username, text);
    comment.appendChild(commentArea);
    if (this.options.userID == (store.getState().user as PayloadUser).id ||
    // TODO если на беке починят обновление постов, то раскомитить
    // ) {
    //   new Button(comment, {
    //     actionType: 'button',
    //     innerIcon: editIcon,
    //     clickHandler: () => {
    //       if (this.options.inEditState) {
    //         this.closeEditor();
    //       } else {
    //         this.openEditor();
    //       }
    //     },
    //     viewType: ButtonType.ICON,
    //   }).addClassNames('comment__edit-btn');
    // } else if (
      this.options.authorID == (store.getState().user as PayloadUser).id) {
      new Button(comment, {
        actionType: 'button',
        innerIcon: closeIcon,
        clickHandler: () => {
          deleteComment(this.options.postID, this.options.id);
        },
        viewType: ButtonType.ICON,
      }).addClassNames('comment__edit-btn');
    }
    return comment;
  }

  private openEditor() {
    this.options.inEditState = true;
    const text = querySelectorWithThrow(this.domElement, '.comment__text');
    text.setAttribute('contenteditable', 'true');
    const editBtnArea = document.createElement('div');
    editBtnArea.classList.add('comment__edit-btn-area', 'btn-area');
    new Button(editBtnArea, {
      actionType: 'button',
      viewType: ButtonType.PRIMARY,
      innerText: 'Сохранить',
      clickHandler: () => {
        if (text.innerText.length > commentSize) {
          notice(
              `Коментарий должен быть меньше ${commentSize} символов`, 'error');
        } else if (text.innerText.length == 0) {
          deleteComment(this.options.postID, this.options.id);
        } else {
          updateComment(this.options.postID, this.options.id, text.innerText);
          // this.options.content = text.innerText;
          this.closeEditor();
        }
      },
    }).addClassNames('btn-area__btn');
    new Button(editBtnArea, {
      actionType: 'button',
      viewType: ButtonType.OUTLINE,
      innerText: 'Отмена',
      clickHandler: () => {
        this.closeEditor();
      },
    }).addClassNames('btn-area__btn');
    new Button(editBtnArea, {
      actionType: 'button',
      viewType: ButtonType.ERROR,
      innerText: 'Удалить',
      clickHandler: () => {
        deleteComment(this.options.postID, this.options.id);
      },
    }).addClassNames('btn-area__btn');
    querySelectorWithThrow(this.domElement, '.comment__area')
        .appendChild(editBtnArea);
  }

  private closeEditor() {
    this.options.inEditState = false;
    const text = querySelectorWithThrow(this.domElement, '.comment__text');
    text.setAttribute('contenteditable', 'false');
    text.innerText = this.options.content;
    querySelectorWithThrow(this.domElement, '.comment__edit-btn-area').remove();
  }
}
