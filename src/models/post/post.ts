import {ReactButton, ReactType} from '@components/reaction/reaction';
import {Glass, GlassType} from '@components/glass/glass';
import {Image, ImageType} from '@components/image/image';
import postHbs from './post.hbs';
import './post.styl';

interface Data {
  post_id: string,
  author: {
    img: string,
    username: string,
  },
  date: string,
  content: string,
  likeCount: string,
  like: boolean,
  commentCount: string,
}

/**
 * Модель поста
 */
export class Post {
  /**
   * Актуальный контейнер поста
   */
  readonly element : HTMLElement;

  /**
   * @param data данные для генерации поста
   */
  constructor(data: Data) {
    const avatarImg = new Image(ImageType.author, '58px', data.author.img);

    const like = new ReactButton(
        ReactType.likes,
        data.likeCount,
        'submit',
        data.like);

    const comment = new ReactButton(
        ReactType.comments,
        data.commentCount,
        'submit', false);

    const glass = new Glass(GlassType.mono);
    this.element = glass.element;
    this.element.classList.add('post');
    this.element.innerHTML = postHbs({
      id: data.post_id,
      avatarImg: avatarImg.element.outerHTML,
      username: data.author.username,
      date: data.date,
      content: data.content,
      likes: like.element.outerHTML,
      comments: comment.element.outerHTML,
    });
  }
}
