import Button, {ButtonType} from '@components/Button/Button';
import templatePost from './post.hbs';
import templateContent from './content.hbs';
import editIcon from '@icon/edit.svg';
import './post.styl';

import {openPostEditor} from '@actions/handlers/editor';
import {PayloadPost} from '@actions/types/posts';
import {unlikePost, likePost} from '@actions/handlers/posts';
import ComponentBase, {querySelectorWithThrow} from '@flux/types/component';
import Avatar, {AvatarType} from '@components/Avatar/Avatar';
import PostAction, {PostActionType} from '@components/PostAction/PostAction';

type PostOptions = PayloadPost & {
  changable: boolean
}

export interface PostUpdateContext {
  content: string
  isLiked: boolean
  likesNum: number
  isAllowed: boolean
  tier: number
}

/**
 * Модель поста
 */
export default
class Post extends ComponentBase<'div', PostUpdateContext> {
  private likeBtn!: PostAction;

  constructor(el: HTMLElement, private options: PostOptions) {
    super();
    this.renderTo(el);
  }

  update(data: PostUpdateContext): void {
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

    this.addReactionBtn(post);

    if (this.options.changable) {
      const header = querySelectorWithThrow(post, '.post__header');
      const editBtn = new Button(header, {
        actionType: 'button',
        innerIcon: editIcon,
        clickHandler: openPostEditor.bind(this, this.options.postID),
        viewType: ButtonType.ICON,
      });
      editBtn.addClassNames('post__header-btn');
    }
    return post;
  }

  private addReactionBtn(post: HTMLElement) {
    const reactionArea = querySelectorWithThrow(post, '.post__reaction');
    this.likeBtn = new PostAction(reactionArea, {
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
    new PostAction(reactionArea, {
      reactType: PostActionType.COMMENT,
      count: 0, // this.options.commentsNum,
      isActive: false,
      clickCallback: () => {
        // TODO экшен на открытие комментариев
      },
    });
  }
}
