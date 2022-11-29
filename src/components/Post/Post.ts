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
  content?: string
  isLiked?: boolean
  likesNum?: number
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
    if (data.isLiked !== undefined && data.likesNum !== undefined) {
      this.options.isLiked = data.isLiked;
      this.likeBtn.update({
        isActive: data.isLiked,
        likesNum: data.likesNum,
      });
    }
    if (data.content) {
      querySelectorWithThrow(this.domElement, '.post__content').innerHTML =
          templateContent({
            text: data.content,
          });
    }
  }

  protected render(): HTMLDivElement {
    const post = document.createElement('div');
    post.classList.add('post', 'post__back');
    post.innerHTML = templatePost({
      username: this.options.author.username,
      date: this.options.dateCreated,
      isAllowed: this.options.isAllowed,
      tier: this.options.tier,
    });

    const avatarArea =
post.querySelector<HTMLElement>('.post__author-avatar');
    if (!avatarArea) throw new Error('Нет элемента с .post__author-avatar');
    const avatar = new Avatar(avatarArea, {
      image: this.options.author.imgPath,
      viewType: AvatarType.AUTHOR,
    });
    avatar.addClassNames('post__img');

    post.querySelector('.post__content')
        ?.insertAdjacentHTML('afterbegin', templateContent({
          text: this.options.content,
        }));

    this.addReactionBtn(post);

    if (this.options.changable) {
      const header = querySelectorWithThrow(post, '.post__header');
      const editBtn = new Button(header, {
        actionType: 'button',
        innerIcon: editIcon,
        clickCallback: openPostEditor.bind(this, this.options.postID),
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
      content: this.options.likesNum.toString(),
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
      content: '0', // this.options.commentsNum.toString(),
      isActive: false,
      clickCallback: () => {
        // TODO экшен на открытие комментариев
      },
    });
  }
}
