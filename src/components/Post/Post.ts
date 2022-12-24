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
  closeComments,
  getComments} from '@actions/handlers/comments';
import {PayloadComment} from '@actions/types/comments';
import {notice} from '@actions/handlers/notice';
import routing from '@actions/handlers/routing';
import CommentArea from '@components/CommentArea/CommentArea';

export enum ContextType {
  RUNTIME_POST_UPDATE,
  EDIT_POST_UPDATE,
  CHANGE_EDIT_STATE,
  COMMENTS,
}

type PostOptions = PayloadPost & {
  changeable: boolean
  inEditState: boolean
  commentsOpened: boolean
};

interface RuntimePostUpdateContext {
  contextType: ContextType.RUNTIME_POST_UPDATE
  inEditState?: boolean
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
  blocked?: boolean
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
  private imgBtn?: Button;
  private submitBtn?: Button;
  private comments!: CommentArea;
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
      case ContextType.EDIT_POST_UPDATE: {
        const image = document.createElement('img');
        image.src = data.url;
        image.classList.add('post-content__image');
        this.content.appendChild(image);
        break;
      }
      case ContextType.RUNTIME_POST_UPDATE:
        this.options.isLiked = data.isLiked;
        this.options.likesNum = data.likesNum;
        this.options.commentsNum = data.commentsNum;
        this.likeBtn.update({
          isActive: data.isLiked,
          likesNum: data.likesNum,
          blocked: false,
        });
        this.commentBtn.update({
          isActive: false,
          likesNum: data.commentsNum,
          blocked: false,
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
          if (querySelectorWithThrow(this.domElement, '.post-content')
              .contentEditable) {
            data.inEditState = true;
          }
          querySelectorWithThrow(this.domElement, '.post__content-area')
              .innerHTML = templateContent({
                isAllowed: data.isAllowed,
                text: data.content,
                subscriptionTitle,
              });
          if (data.inEditState) {
            querySelectorWithThrow(this.domElement, '.post-content')
                .setAttribute('contenteditable', 'true');
          }
          const returnBtn =
            this.domElement.querySelector('.post__return-btn');
          returnBtn?.addEventListener('click', () => {
            if (location.pathname === '/feed') {
              routing(`/profile?id=${this.options.author.userID}`);
            } else {
              document.querySelector('.subscription-cards-container')
                  ?.scrollIntoView();
            }
          },
          );
        }
        break;
      case ContextType.COMMENTS:
        this.comments.update(data);
        break;
      default: {
        const _: never = data;
        return _;
      }
    }
    this.imgBtn?.update({blocked: false});
    this.submitBtn?.update({blocked: false});
  }

  protected render(): HTMLDivElement {
    const post = document.createElement('div');
    post.classList.add('post', 'post__back', 'bg_main');
    // render шапки поста
    post.innerHTML = templatePost({
      id: this.options.author.userID,
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

    // render контента поста
    const contentArea = querySelectorWithThrow(post, '.post__content-area');

    const subscriptionTitle =
          (store.getState().profile as PayloadGetProfileData)
              .authorSubscriptions?.at(this.options.tier - 1)?.title;

    contentArea.innerHTML = templateContent({
      isAllowed: this.options.isAllowed,
      text: this.options.content,
      subscriptionTitle,
    });
    const returnBtn =
            contentArea.querySelector('.post__return-btn');
    returnBtn?.addEventListener('click', () => {
      if (location.pathname === '/feed') {
        routing(`/profile?id=${this.options.author.userID}`);
      } else {
        document.querySelector('.subscription-cards-container')
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
      }
    },
    );

    // render остального
    if (this.options.inEditState) {
      this.openEditor(post);
    } else {
      this.renderActions(post);

      if (this.options.changeable) {
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
    this. comments = new CommentArea(post, {
      authorID: this.options.author.userID,
      PostID: this.options.postID,
      commentMap: new Map<number, PayloadComment>(),
      commentsOpened: false,
    });
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
        if (this.options.isAllowed) {
          this.likeBtn.update({
            likesNum: this.options.likesNum,
            isActive: this.options.isLiked,
            blocked: true,
          });
          if (this.options.isLiked) {
            unlikePost(this.options.postID);
          } else {
            likePost(this.options.postID);
          }
        } else {
          notice('Нет доступа к посту', 'info');
        }
      },
    });
    this.commentBtn = new PostAction(buttonsArea, {
      reactType: PostActionType.COMMENT,
      count: this.options.commentsNum,
      isActive: false,
      clickCallback: () => {
        if (this.options.isAllowed) {
          this.commentBtn.update({
            likesNum: this.options.commentsNum,
            isActive: false,
            blocked: true,
          });
          if (this.options.commentsOpened) {
            this.options.commentsOpened = false;
            closeComments(this.options.postID);
          } else {
            this.options.commentsOpened = true;
            getComments(this.options.postID);
          }
        } else {
          notice('Нет доступа к комментариям', 'info');
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
    this.content.addEventListener('paste', (e) => {
      e.preventDefault();
      notice('Вставка запрещена', 'info');
    });

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
        text: `по подписке ${sub.title}`,
        value: sub.tier.toString(),
      };
    });
    dropboxOptions.unshift({
      text: 'для всех',
      value: '0',
    });

    const tierBtn = new Dropbox(form, {
      label: 'Доступно:',
      name: 'tier',
      options: dropboxOptions,
      selected: this.options.tier.toString(),
      title: 'Ограничение видимости поста по подписке',
    });
    tierBtn.addClassNames('post-edit-form__tier');

    // TODO блокировку сделать или удалить все таки
    const headerBtn = new Button(form, {
      actionType: 'button',
      viewType: ButtonType.ICON,
      innerIcon: headerIcon,
      title: 'Добавить заголовок в начало поста',
      clickHandler: () => {
        const h1 = document.createElement('h1');
        h1.innerHTML = 'Заголовок';
        this.htmlTextElementsInContent.add(h1);
        this.content.insertBefore(h1, this.content.firstChild);
      },
    });
    headerBtn.addClassNames('post-edit-form__h1');

    const formBtns = document.createElement('div');
    formBtns.classList.add('post-edit-form__btn', 'btn-area');

    this.submitBtn = new Button(formBtns, {
      actionType: 'submit',
      viewType: ButtonType.PRIMARY,
      innerText: this.options.postID == -1 ? 'Создать' : 'Сохранить',
    });

    this.submitBtn.addClassNames('btn-area__btn');
    this.imgBtn = new Button(form, {
      actionType: 'button',
      viewType: ButtonType.IMAGE_LOADING,
      innerIcon: loadImageIcon,
      title: 'Загрузить изображение в конец поста',
      clickHandler: (e) => {
        this.submitBtn?.update({blocked: true});
        this.imgBtn?.update({blocked: true});
        const image = (e.target as HTMLInputElement);
        if (image.files && image.files.length !== 0) {
          putImage(this.options.postID, image.files[0]);
        }
      },
    });
    this.imgBtn.addClassNames('post-edit-form__img');

    form.appendChild(formBtns);

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
}


