import Button, {ButtonType} from '@components/Button/Button';
import templatePost from './post.hbs';
import templateContent from './content.hbs';
import editIcon from '@icon/edit.svg';
import headerIcon from '@icon/header.svg';
import loadImageIcon from '@icon/loadImage.svg';

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
import InputField, {InputType} from '@components/InputField/InputField';
import dateFormate from '@date/dateFormate';
import {closeEditor, openPostEditor} from '@actions/handlers/editor';

export enum ContextType {
  RUNTIME_POST_UPDATE,
  EDIT_POST_UPDATE,
  CHANGE_EDIT_STATE,
}

type PostOptions = PayloadPost & {
  changable: boolean
  inEditState: boolean
};

interface RuntimePostUpdateContext {
  contextType: ContextType.RUNTIME_POST_UPDATE
  inEditState: false
  content: string
  isLiked: boolean
  likesNum: number
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

export type PostUpdateContext =
  | RuntimePostUpdateContext
  | EditPostUpdateContext
  | ChangeEditStateContext;

interface EditForm extends HTMLCollection {
  tier: HTMLInputElement;
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
        return;
      case ContextType.RUNTIME_POST_UPDATE:
        this.options.isLiked = data.isLiked;
        this.options.likesNum = data.likesNum;
        this.likeBtn.update({
          isActive: data.isLiked,
          likesNum: data.likesNum,
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
          querySelectorWithThrow(this.domElement, '.post__content-area')
              .innerHTML = templateContent({
                isAllowed: data.isAllowed,
                text: data.content,
                tier: data.tier,
              });
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
    contentArea.innerHTML = templateContent({
      isAllowed: this.options.isAllowed,
      text: this.options.content,
      tier: this.options.tier,
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
      count: 0, // this.options.commentsNum,
      isActive: false,
      clickCallback: () => {
        // TODO экшен на открытие комментариев
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

    const tierField = document.createElement('div');
    tierField.classList.add('post-edit-form__tier');
    const tierText = document.createElement('div');
    tierText.classList.add('post-edit-form__tier-text', 'font_regular');
    tierText.innerText = 'Уровень подписки:';
    tierField.appendChild(tierText);
    const tierBtn = new InputField(tierField, {
      name: 'tier',
      kind: InputType.number,
      value: this.options.tier.toString(),
      displayError: false,
    });
    tierBtn.addClassNames('post-edit-form__tier-input');
    form.appendChild(tierField);

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
}


