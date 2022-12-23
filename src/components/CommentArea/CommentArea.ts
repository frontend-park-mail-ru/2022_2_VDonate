import {addComment} from '@actions/handlers/comments';
import {notice} from '@actions/handlers/notice';
import {PayloadComment} from '@actions/types/comments';
import Button, {ButtonType} from '@components/Button/Button';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import {commentSize} from '@validation/validation';
import Comment from '@components/Comment/Comment';
import './comment-area.styl';

interface CommentsOptions {
  authorID: number
  PostID: number
  commentMap: Map<number, PayloadComment>
  commentsOpened: boolean
}

interface CommentsContext {
  commentMap?: Map<number, PayloadComment>
  commentID?: number
  comment?: PayloadComment
  blocked?: boolean
}
export default class CommentArea
  extends ComponentBase<'div', CommentsContext | boolean> {
  private commentsState = new Map<number, PayloadComment>();
  private comments = new Map<number, Comment>();
  private submitCommentBtn!: Button;
  constructor(el: HTMLElement, private options: CommentsOptions) {
    super();
    this.renderTo(el);
  }

  protected render(): HTMLDivElement {
    const newComment = document.createElement('div');
    newComment.classList.add('comment-area');
    const commentArea = document.createElement('div');
    commentArea.classList.add('comment-area__comment-area');
    const form = document.createElement('form');
    form.classList.add('comment-area__form');
    const input = document.createElement('div');
    input.setAttribute('contenteditable', 'true');
    input.classList.add('comment-area__input', 'bg_input', 'font_regular');
    form.appendChild(input);
    this.submitCommentBtn = new Button(form, {
      actionType: 'submit',
      viewType: ButtonType.PRIMARY,
      innerText: 'Отправить',
    });
    this.submitCommentBtn.addClassNames('comment-area__submit');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitCommentBtn.update({blocked: true});
      input.innerText = input.innerText.trim();
      if (input.innerText.length == 0) {
        notice('Вы ввели пустой комментарий', 'error');
      } else if (input.innerText.length > commentSize) {
        notice(
            `Комментарий должен быть меньше ${commentSize} символов`, 'error');
      } else {
        addComment(this.options.PostID, input.innerText);
      }
    });
    newComment.append(commentArea, form);
    newComment.style.display = 'none';
    return newComment;
  }

  update(data: CommentsContext): void {
    this.submitCommentBtn.update({blocked: false});
    if (typeof data.blocked == 'boolean') return;
    if (data.commentMap) {
      this.commentsState = data.commentMap;
      this.openComments(data.commentMap);
    } else if (data.comment) {
      if (data.commentID) {
        this.comments.get(data.commentID)?.update(data.comment.content);
      } else {
        querySelectorWithThrow(this.domElement, '.comment-area__input')
            .innerText = '';
        this.addComment(data.comment);
      }
    } else if (data.commentID) {
      this.deleteComment(data.commentID);
    } else {
      this.closeComments();
    }
  }

  private openComments(comments: Map<number, PayloadComment>) {
    this.commentsState = comments;
    this.options.commentsOpened = true;
    const hr = document.createElement('hr');
    hr.classList.add('comment-hr', 'bg_hr');
    const commentArea =
    querySelectorWithThrow(this.domElement, '.comment-area__comment-area');
    commentArea.appendChild(hr);
    comments.forEach((comment) => {
      this.comments.set(comment.id,
          new Comment(commentArea, {
            ...comment,
            authorID: this.options.authorID,
            inEditState: false,
            postID: this.options.PostID,
          }),
      );
    });
    this.domElement.style.removeProperty('display');
  }

  private addComment(comment: PayloadComment) {
    this.commentsState.set(comment.id, comment);
    this.comments.set(
        comment.id,
        new Comment(
            querySelectorWithThrow(
                this.domElement, '.comment-area__comment-area'),
            {
              ...comment,
              inEditState: false,
              postID: this.options.PostID,
            },
        ),
    );
  }

  private deleteComment(commentID: number) {
    this.comments.get(commentID)?.remove();
    this.comments.delete(commentID);
    this.commentsState.delete(commentID);
  }

  private closeComments() {
    this.commentsState = new Map<number, PayloadComment>();
    this.comments.forEach((o) => o.remove());
    this.comments = new Map<number, Comment>();
    this.options.commentsOpened = false;
    querySelectorWithThrow(this.domElement, '.comment-area__comment-area')
        .innerHTML = '';
    this.domElement.style.display = 'none';
  }
}
