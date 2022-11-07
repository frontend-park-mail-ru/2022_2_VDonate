import {ReactButton, ReactType} from '@components/reaction/reaction';
import {Image, ImageType} from '@components/image/image';
import {IconButton} from '@components/icon_button/icon_button';
import {Popup} from '../popup/post_and_about/popup';
import template from './post.hbs';
import editIcon from '@icon/edit.svg';
import './post.styl';
import store from '@app/store';

interface PostContext {
  postID: number,
  author: {
    id: number,
    img: string,
    username: string,
  },
  date: Date,
  content: string,
  likeCount: number,
  isLikedByMe: boolean,
  commentCount: number,
}

/**
 * Модель поста
 */
export class Post {
  /**
   * Актуальный контейнер поста
   */
  readonly element: HTMLElement;

  /**
   * @param context данные для генерации поста
   */
  constructor(context: PostContext) {
    const avatarImg = new Image(ImageType.author, '58px', context.author.img);

    const like = new ReactButton(
        ReactType.likes,
        context.likeCount.toString(),
        'button',
        context.isLikedByMe);

    like.element.addEventListener('click',
        () => {
          // TODO экшен на лайки
        });

    const comment = new ReactButton(
        ReactType.comments,
        context.commentCount.toString(),
        'button', false);
    comment.element.addEventListener('click',
        () => {
          // TODO экшен на открытие комментариев
        });

    const post = document.createElement('div');

    post.classList.add('post', 'post__back');
    post.innerHTML = template({
      username: context.author.username,
      date: context.date.toDateString(),
      content: context.content,
    });
    post.querySelector('.post__author-avatar')?.appendChild(avatarImg.element);
    post.querySelector('.post__reaction')
        ?.append(like.element, comment.element);
    if ((store.getState().user as {id: number}).id === context.author.id) {
      const editBtn = new IconButton(editIcon, 'button');
      editBtn.element.classList.add('post__head_btn');
      post.querySelector('post__head')?.appendChild(editBtn.element);
      const popup = new Popup(
          'Изменить пост',
          context.content,
          () => {
            // TODO: вызвать изменение вместо пустой фунции
          });
      editBtn.element.addEventListener('click',
          () => {
            popup.element.style.display = 'flex';
          });
      document.getElementById('entry')?.appendChild(popup.element);
    }

    this.element = post;
  }
}
