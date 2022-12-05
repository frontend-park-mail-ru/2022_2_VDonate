import Button, {ButtonType} from '@components/Button/Button';
import templatePost from './post.hbs';
import templateContent from './content.hbs';
import editIcon from '@icon/edit.svg';
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

type PostOptions = PayloadPost & {
  changable: boolean
  inEditState: boolean
};

interface RuntimePostUpdateContext {
  inEditState: false
  content: string
  isLiked: boolean
  likesNum: number
  isAllowed: boolean
  tier: number
}

interface EditPostUpdateContext {
  inEditState: true
  url: string
}

export type PostUpdateContext =
  | RuntimePostUpdateContext
  | EditPostUpdateContext;

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

  constructor(el: HTMLElement, private options: PostOptions) {
    super();
    this.renderTo(el);
  }

  update(data: PostUpdateContext): void {
    if (data.inEditState && this.options.inEditState) {
      const image = document.createElement('img');
      image.src = data.url;
      image.classList.add('post-content__image');
      this.content.appendChild(image);
      return;
    }
    if (!data.inEditState && !this.options.inEditState) {
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

        querySelectorWithThrow(this.domElement, '.post__content').innerHTML =
          templateContent({
            isAllowed: data.isAllowed,
            text: data.content,
            tier: data.tier,
          });
      }
      return;
    }
  }

  protected render(): HTMLDivElement {
    const post = document.createElement('div');
    post.classList.add('post', 'post__back');
    post.innerHTML = templatePost({
      username: this.options.author.username,
      date: this.options.dateCreated,
    });
    const avatarArea = querySelectorWithThrow(post, '.post__author-avatar');
    const avatar = new Avatar(avatarArea, {
      imgPath: this.options.author.imgPath,
      viewType: AvatarType.AUTHOR,
    });
    avatar.addClassNames('post__img');

    const contentArea = querySelectorWithThrow(post, '.post__content');
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
              this.options.inEditState = false;
              this.closeEditor();
            } else {
              this.options.inEditState = true;
              this.openEditor();
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
          '.post__buttons-area',
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

  private openEditor(domElement?: HTMLElement) {
    this.content =
      querySelectorWithThrow(domElement ?? this.domElement, '.post-content');
    this.content.setAttribute('contenteditable', 'true');

    const buttonsArea =
      querySelectorWithThrow(
          domElement ?? this.domElement,
          '.post__buttons-area',
      );
    buttonsArea.innerHTML = '';

    const form = document.createElement('form');
    form.classList.add('post__edit-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // TODO отправить создание поста
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
      this.closeEditor();
    });
    buttonsArea.appendChild(form);


    new InputField(form, {
      name: 'tier',
      kind: InputType.number,
      label: 'Уровень доступа',
      displayError: false,
    });
    new InputField(form, {
      name: 'image',
      kind: InputType.file,
      label: 'Изображение',
      displayError: false,
    });
    const image = querySelectorWithThrow(
        form,
        'input[type=file]',
    ) as HTMLInputElement;
    image.addEventListener('change', () => {
      if (image.files && image.files.length !== 0) {
        putImage(this.options.postID, image.files[0]);
      }
    });

    new Button(form, {
      actionType: 'submit',
      viewType: ButtonType.PRIMARY,
      innerText: 'Сохранить',
    });
    new Button(form, {
      actionType: 'button',
      viewType: ButtonType.OUTLINE,
      innerText: 'Отмена',
      clickHandler: () => {
        this.content.innerHTML = this.options.content;
        this.closeEditor();
      },
    });
    if (this.options.postID !== -1) {
      new Button(form, {
        actionType: 'button',
        viewType: ButtonType.OUTLINE,
        innerText: 'Удалить',
        clickHandler: () => {
          deletePost(this.options.postID);
        },
      });
    }

    this.content.focus();
  }

  private closeEditor() {
    if (this.options.postID === -1) {
      this.remove();
    } else {
      const content = querySelectorWithThrow(this.domElement, '.post-content');
      content.setAttribute('contenteditable', 'false');
      querySelectorWithThrow(this.domElement, '.post__edit-form').remove();
      this.renderActions();
    }
  }
}


