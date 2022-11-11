import {ReactButton, ReactType} from '@components/reaction/reaction';
import {Image, ImageType} from '@components/image/image';
import {IconButton} from '@components/icon_button/icon_button';
import templatePost from './post.hbs';
import templateContent from './content.hbs';
import editIcon from '@icon/edit.svg';
import './post.styl';

import {openPostEditor} from '@actions/handlers/editor';
import {PayloadPost} from '@actions/types/posts';
import {unlikePost, likePost} from '@actions/handlers/posts';

/**
 * Модель поста
 */
export class Post {
  /** Актуальный контейнер поста */
  readonly element: HTMLElement;
  private isLiked: boolean;

  /**
   * @param context данные для генерации поста
   * @param changable -
   */
  constructor(context: PayloadPost, changable: boolean) {
    this.isLiked = context.isLiked;
    const avatarImg = new Image(ImageType.author, context.author.img);
    avatarImg.element.classList.add('post__img');
    const like = new ReactButton(
        ReactType.likes,
        context.likesNum.toString(),
        'button',
        context.isLiked);

    like.element.addEventListener('click',
        () => {
          if (this.isLiked) {
            unlikePost(context.postID);
          } else {
            likePost(context.postID);
          }
        });

    const comment = new ReactButton(
        ReactType.comments,
        context.commentsNum.toString(),
        'button', false);
    comment.element.addEventListener('click',
        () => {
          // TODO экшен на открытие комментариев
        });

    const post = document.createElement('div');

    post.classList.add('post', 'post__back');
    post.innerHTML = templatePost({
      username: context.author.username,
      date: context.date.toDateString(),
    });
    post.querySelector('.post__content')
        ?.insertAdjacentHTML('afterbegin', templateContent({
          title: context.content.title,
          img: context.content.img,
          text: context.content.text,
        }));

    post.querySelector('.post__author-avatar')?.appendChild(avatarImg.element);
    post.querySelector('.post__reaction')
        ?.append(like.element, comment.element);
    if (changable) {
      const editBtn = new IconButton(editIcon, 'button');
      editBtn.element.classList.add('post__header_btn');
      post.querySelector('.post__header')?.appendChild(editBtn.element);
      editBtn.element.addEventListener('click',
          () => {
            openPostEditor(context.postID);
          });
    }

    this.element = post;
  }
}
