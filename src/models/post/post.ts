import {ReactButton, ReactType} from '@components/reaction/reaction';
import {Image, ImageType} from '@components/image/image';
import {IconButton} from '@components/icon_button/icon_button';
import templatePost from './post.hbs';
import templateContent from './content.hbs';
import editIcon from '@icon/edit.svg';
import './post.styl';

import {postEditor} from '@actions/handlers/editor';

interface PostContext {
  postID: number
  author: {
    id: number
    img: string
    username: string
  }
  date: Date
  content: {
    title: string
    img: string
    text: string
  }
  likeCount: number
  isLikedByMe: boolean
  commentCount: number
  changable: boolean
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
    const avatarImg = new Image(ImageType.author, context.author.img);
    avatarImg.element.classList.add('post__img');
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
    if (context.changable) {
      const editBtn = new IconButton(editIcon, 'button');
      editBtn.element.classList.add('post__header_btn');
      post.querySelector('.post__header')?.appendChild(editBtn.element);
      editBtn.element.addEventListener('click',
          () => {
            postEditor(context.postID);
          });
      // const popup = new Popup(
      //     'Изменить пост',
      //     context.contentHTML,
      //     () => {
      //       // TODO: вызвать изменение вместо пустой фунции
      //     });

      // const editor = new Editor({
      //   title: context.content.title,
      //   text: context.content.text,
      // });
      // editor.element.addEventListener('submit',
      //     (e) => {
      //       e.preventDefault();
      //       console.warn((e.target as HTMLFormElement).elements);
      //     });
      // post.appendChild(editor.element);
    }

    this.element = post;
  }
}
