import {ReactButton, ReactType} from '@components/reaction/reaction';
import {Glass, GlassType} from '@components/glass/glass';
import {Image, ImageType} from '@components/image/image';
import {IconButton} from '@components/icon_button/icon_button';
import {Popup} from '../popup/post_and_about/popup';
import postHbs from './post.hbs';
import redactIcn from '@icon/redact.svg';
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
  changeable: boolean,
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
   * @param data данные для генерации поста
   */
  constructor(data: Data) {
    const avatarImg = new Image(ImageType.author, data.author.img);
    avatarImg.element.classList.add('post__img');
    const like = new ReactButton(
        ReactType.likes,
        data.likeCount,
        'button',
        data.like);

    like.element.onclick = () => {
      // TODO: вызов лайка
    };

    const comment = new ReactButton(
        ReactType.comments,
        data.commentCount,
        'button', false);

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
    if (data.changeable) {
      this.element.getElementsByClassName('post__head');
      const head = this.element.getElementsByClassName('post__head');
      const redactBtn = new IconButton(redactIcn, 'button');
      redactBtn.element.classList.add('post__head_btn');
      head[0].appendChild(redactBtn.element);
      const popup = new Popup(
          'Изменить пост',
          data.content,
          ()=>{
            // TODO: вызвать изменение вместо пустой фунции
            return true;
          });
      redactBtn.element.onclick = () => {
        popup.element.style.display = 'flex';
      };
      document.getElementById('entry')?.appendChild(popup.element);
    }
  }
}
