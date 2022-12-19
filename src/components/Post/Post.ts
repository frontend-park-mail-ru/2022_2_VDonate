import Button, {ButtonType} from '@components/Button/Button';
import templatePost from './post.hbs';
import templateContent from './content.hbs';
import editIcon from '@icon/edit.svg';
import headerIcon from '@icon/header.svg';
import loadImageIcon from '@icon/loadImage.svg';
import store from '@app/Store';
import './post.styl';

import {PayloadPost} from '@actions/types/posts';
import {
  unlikePost,
  likePost,
  createPost,
  updatePost,
  putImage,
  deletePost,
} from '@actions/handlers/posts';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import Avatar, {AvatarType} from '@components/Avatar/Avatar';
import PostAction, {PostActionType} from '@components/PostAction/PostAction';
import dateFormate from '@date/dateFormate';
import {closeEditor, openPostEditor} from '@actions/handlers/editor';
import Dropbox from '@components/Dropbox/Dropbox';
import {PayloadGetProfileData} from '@actions/types/getProfileData';
import {
  addComment,
  closeComments,
  getComments} from '@actions/handlers/comments';
import {PayloadComment} from '@actions/types/comments';
import Comment from '@components/Comment/Comment';
import {notice} from '@actions/handlers/notice';
import {commentSize} from '@validation/validation';

export enum ContextType {
  RUNTIME_POST_UPDATE,
  EDIT_POST_UPDATE,
  CHANGE_EDIT_STATE,
  COMMENTS,
}

type PostOptions = PayloadPost & {
  changable: boolean
  inEditState: boolean
  commentsOpened: boolean
};

interface RuntimePostUpdateContext {
  contextType: ContextType.RUNTIME_POST_UPDATE
  inEditState: false
  content: string
  isLiked: boolean
  likesNum: number
  commentsNum: number
  isAllowed: boolean
  tier: number
}

interface EditPostUpdateContext {
  contextType: ContextType.EDIT_POST_UPDATE
  inEditState: true
  url: string
}

interface ChangeEditStateContext {
  contextType: ContextType.CHANGE_EDIT_STATE
  NewEditState: boolean
}
interface CommentsContext {
  contextType: ContextType.COMMENTS
  commentMap?: Map<number, PayloadComment>
  commentID?: number
  comment?: PayloadComment
}
export type PostUpdateContext =
  | RuntimePostUpdateContext
  | EditPostUpdateContext
  | ChangeEditStateContext
  | CommentsContext;

interface EditForm extends HTMLCollection {
  tier: HTMLSelectElement;
}

/**
 * Модель поста
 */
export default
class Post extends ComponentBase<'div', PostUpdateContext> {
  private likeBtn!: PostAction;
  private commentBtn!: PostAction;
  private content!: HTMLElement;
  private htmlTextElementsInContent = new Set<HTMLElement>();
  private commentsState = new Map<number, PayloadComment>();
  private comments = new Map<number, Comment>();

  constructor(el: HTMLElement, private options: PostOptions) {
    super();
    this.renderTo(el);
  }

  update(data: PostUpdateContext): void {
    switch (data.contextType) {
      case ContextType.CHANGE_EDIT_STATE:
        if (data.NewEditState) {
          this.openEditor(this.domElement);
        } else {
          if (this.options.inEditState) {
            this.closeEditor();
          }
        }
        this.options.inEditState = data.NewEditState;
        break;
      case ContextType.EDIT_POST_UPDATE:
        // eslint-disable-next-line no-case-declarations
        const image = document.createElement('img');
        image.src = data.url;
        image.classList.add('post-content__image');
        this.content.appendChild(image);
        break;
      case ContextType.RUNTIME_POST_UPDATE:
        this.options.isLiked = data.isLiked;
        this.options.likesNum = data.likesNum;
        this.options.commentsNum = data.commentsNum;
        this.likeBtn.update({
          isActive: data.isLiked,
          likesNum: data.likesNum,
        });
        this.commentBtn.update({
          isActive: false,
          likesNum: data.commentsNum,
        });

        if (
        // Изменился уровень доступа
          data.isAllowed !== this.options.isAllowed ||
        // У нас нет доступа и изменился тир
        !this.options.isAllowed && data.tier != this.options.tier ||
        // Изменился контент
        data.content !== this.options.content
        ) {
          this.options.isAllowed = data.isAllowed;
          this.options.content = data.content;
          this.options.tier = data.tier;

          const subscriptionTitle =
            (store.getState().profile as PayloadGetProfileData)
                .authorSubscriptions?.at(data.tier - 1)?.title;

          querySelectorWithThrow(this.domElement, '.post__content-area')
              .innerHTML = templateContent({
                isAllowed: data.isAllowed,
                text: data.content,
                subscriptionTitle,
              });
        }
        break;
      case ContextType.COMMENTS:
        if (data.commentMap) {
          this.commentsState = data.commentMap;
          this.openComments(data.commentMap);
        } else if (data.comment) {
          if (data.commentID) {
            this.comments.get(data.commentID)?.update(data.comment.content);
          } else {
            querySelectorWithThrow(this.domElement, '.new-comment__input')
                .innerText = '';
            this.addComment(data.comment);
          }
        } else if (data.commentID) {
          this.deleteComment(data.commentID);
        } else {
          this.closeComments();
        }
        break;
      default: {
        const _: never = data;
        return _;
      }
    }
  }

  protected render(): HTMLDivElement {
    const post = document.createElement('div');
    post.classList.add('post', 'post__back', 'bg_main');
    post.innerHTML = templatePost({
      username: this.options.author.username,
      date: (typeof this.options.dateCreated == 'undefined' ||
             this.options.dateCreated.length === 0) ?
        'В процессе...' : dateFormate(this.options.dateCreated),
    });
    const avatarArea = querySelectorWithThrow(post, '.post__author-avatar');
    const avatar = new Avatar(avatarArea, {
      imgPath: this.options.author.imgPath,
      viewType: AvatarType.AUTHOR,
    });
    avatar.addClassNames('post__img');

    const contentArea = querySelectorWithThrow(post, '.post__content-area');

    const subscriptionTitle =
          (store.getState().profile as PayloadGetProfileData)
              .authorSubscriptions?.at(this.options.tier - 1)?.title;

    contentArea.innerHTML = templateContent({
      isAllowed: this.options.isAllowed,
      text: this.options.content,
      subscriptionTitle,
    });

    if (this.options.inEditState) {
      this.openEditor(post);
    } else {
      this.renderActions(post);

      if (this.options.changable) {
        const header = querySelectorWithThrow(post, '.post__header');
        const editBtn = new Button(header, {
          actionType: 'button',
          innerIcon: editIcon,
          clickHandler: () => {
            if (this.options.inEditState) {
              closeEditor(this.options.postID);
            } else {
              openPostEditor(this.options.postID);
            }
          },
          viewType: ButtonType.ICON,
        });
        editBtn.addClassNames('post__header-btn');
      }
    }
    const newComment =
    querySelectorWithThrow(post, '.new-comment');
    const form = document.createElement('form');
    form.classList.add('new-comment__form');
    const input = document.createElement('div');
    input.setAttribute('contenteditable', 'true');
    input.classList.add('new-comment__input', 'bg_input', 'font_regular');
    form.appendChild(input);
    new Button(form, {
      actionType: 'submit',
      viewType: ButtonType.PRIMARY,
      innerText: 'Отправить',
    }).addClassNames('new-comment__submit');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.innerText.length == 0) {
        notice('Вы ввели пустой коментарий', 'error');
      } else if (input.innerText.length > commentSize) {
        notice(
            `Коментарий должен быть меньше ${commentSize} символов`, 'error');
      } else {
        addComment(this.options.postID, input.innerText);
      }
    });
    newComment.appendChild(form);
    newComment.hidden = true;
    return post;
  }

  private renderActions(domElement?: HTMLElement): void {
    const buttonsArea =
      querySelectorWithThrow(
          domElement ?? this.domElement,
          '.post__btn-area',
      );
    this.likeBtn = new PostAction(buttonsArea, {
      reactType: PostActionType.LIKE,
      count: this.options.likesNum,
      isActive: this.options.isLiked,
      clickCallback: () => {
        if (this.options.isLiked) {
          unlikePost(this.options.postID);
        } else {
          likePost(this.options.postID);
        }
      },
    });
    this.commentBtn = new PostAction(buttonsArea, {
      reactType: PostActionType.COMMENT,
      count: this.options.commentsNum,
      isActive: false,
      clickCallback: () => {
        if (this.options.isAllowed) {
          if (this.options.commentsOpened) {
            closeComments(this.options.postID);
          } else {
            getComments(this.options.postID);
          }
        } else {
          notice('Нет доступа к коментариям', 'info');
        }
      },
    });
  }

  private onContentInput(): void {
    this.htmlTextElementsInContent.forEach((el) => {
      if (el.innerText === '\n') {
        el.remove();
        this.htmlTextElementsInContent.delete(el);
      }
    });
  }

  private openEditor(domElement?: HTMLElement) {
    this.options.inEditState = true;
    this.content =
      querySelectorWithThrow(domElement ?? this.domElement, '.post-content');
    this.content.setAttribute('contenteditable', 'true');
    this.content.addEventListener('input', this.onContentInput.bind(this));
    this.content.querySelectorAll('h1').forEach((el) => {
      this.htmlTextElementsInContent.add(el);
    });

    const buttonsArea =
      querySelectorWithThrow(
          domElement ?? this.domElement,
          '.post__btn-area',
      );
    buttonsArea.innerHTML = '';

    const form = document.createElement('form');
    form.classList.add('post__edit-form', 'post-edit-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.options.postID === -1) {
        createPost(this.content.innerHTML,
            Number(((e.target as HTMLFormElement).elements as EditForm)
                .tier.value),
        );
      } else {
        this.options.content = this.content.innerHTML;
        updatePost(
            this.options.postID,
            this.content.innerHTML,
            Number(((e.target as HTMLFormElement).elements as EditForm)
                .tier.value),
        );
      }
    });
    buttonsArea.appendChild(form);

    const subs = (store.getState().profile as PayloadGetProfileData)
        .authorSubscriptions;
    if (!subs) {
      throw new Error('Error: no author subs for open post editor');
    }
    const dropboxOptions = Array.from(subs, (sub) => {
      return {
        text: sub.title,
        value: sub.tier.toString(),
      };
    });
    dropboxOptions.unshift({
      text: 'Без ограничения',
      value: '0',
    });

    const tierBtn = new Dropbox(form, {
      label: 'Ограничение:',
      name: 'tier',
      options: dropboxOptions,
      selected: this.options.tier.toString(),
    });
    tierBtn.addClassNames('post-edit-form__tier');
    // form.appendChild(tierField);

    const headerBtn = new Button(form, {
      actionType: 'button',
      viewType: ButtonType.ICON,
      innerIcon: headerIcon,
      clickHandler: () => {
        const h1 = document.createElement('h1');
        h1.innerHTML = 'Заголовок';
        this.htmlTextElementsInContent.add(h1);
        this.content.insertBefore(h1, this.content.firstChild);
      },
    });
    headerBtn.addClassNames('post-edit-form__h1');

    const imgBtn = new Button(form, {
      actionType: 'button',
      viewType: ButtonType.IMAGE_LOADING,
      innerIcon: loadImageIcon,
      clickHandler: (e) => {
        const image = (e.target as HTMLInputElement);
        if (image.files && image.files.length !== 0) {
          putImage(this.options.postID, image.files[0]);
        }
      },
    });
    imgBtn.addClassNames('post-edit-form__img');


    const formBtns = document.createElement('div');
    formBtns.classList.add('post-edit-form__btn', 'btn-area');
    form.appendChild(formBtns);

    const saveBtn = new Button(formBtns, {
      actionType: 'submit',
      viewType: ButtonType.PRIMARY,
      innerText: 'Сохранить',
    });
    saveBtn.addClassNames('btn-area__btn');

    const cancelBtn = new Button(formBtns, {
      actionType: 'button',
      viewType: ButtonType.OUTLINE,
      innerText: 'Отмена',
      clickHandler: () => {
        this.content.innerHTML = this.options.content;
        closeEditor(this.options.postID);
      },
    });
    cancelBtn.addClassNames('btn-area__btn');

    if (this.options.postID !== -1) {
      const delBtn = new Button(formBtns, {
        actionType: 'button',
        viewType: ButtonType.ERROR,
        innerText: 'Удалить',
        clickHandler: () => {
          deletePost(this.options.postID);
        },
      });
      delBtn.addClassNames('btn-area__btn');
    }

    this.content.focus();
  }

  private closeEditor() {
    this.options.inEditState = false;
    if (this.options.postID === -1) {
      this.remove();
    } else {
      const content = querySelectorWithThrow(this.domElement, '.post-content');
      content.setAttribute('contenteditable', 'false');
      querySelectorWithThrow(this.domElement, '.post-edit-form').remove();
      this.renderActions();
    }
    this.htmlTextElementsInContent.clear();
  }

  private openComments(comments: Map<number, PayloadComment>) {
    this.commentsState = comments;
    this.options.commentsOpened = true;
    const commentArea =
      querySelectorWithThrow(this.domElement, '.post__comment-area');
    const hr = document.createElement('hr');
    hr.classList.add('post-hr', 'bg_hr');
    commentArea.appendChild(hr);
    comments.forEach((comment) => {
      this.comments.set(comment.id,
          new Comment(commentArea, {
            ...comment,
            authorID: this.options.author.userID,
            inEditState: false,
            postID: this.options.postID,
          }),
      );
    });
    querySelectorWithThrow(this.domElement, '.new-comment').hidden = false;
  }

  private addComment(comment: PayloadComment) {
    this.commentsState.set(comment.id, comment);
    this.comments.set(
        comment.id,
        new Comment(
            querySelectorWithThrow(this.domElement, '.post__comment-area'),
            {
              ...comment,
              inEditState: false,
              postID: this.options.postID,
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
    querySelectorWithThrow(this.domElement, '.post__comment-area')
        .innerHTML = '';
    querySelectorWithThrow(this.domElement, '.new-comment').hidden = true;
  }
}


