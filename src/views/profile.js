/**
 * Модуль рендера страницы профиля
 * @module profile
 */

import errorTemplate from '@template/error.handlebars';
import navbarTemplate from '@template/navbar.handlebars';
import userTemplate from '@template/user.handlebars';
import logoutIcon from '@icon/logout.svg';
import errorImg from '@img/error.jpg';
import img0 from '@img/0.jpg';
import img4 from '@img/4.jpg';
import likesIcon from '@icon/like.svg';
import commentIcon from '@icon/comment.svg';

/**
 * Функция, создающая контекст для страницы профиля донатера
 * @param {Object} body объект ответа согласно API
 * @return {Object} объект с контекстом
 */
const createDonaterJSON = (body) => {
  const donater = {
    owner: {
      username: body.username,
      tags: 'Донатер',
      avatar: img0,
      isAuthor: false,
    },
    subscriptions: [],
  };
  return donater;
};

/**
 * Функция, создающая контекст для страницы профиля автора
 * @param {Object} body объект ответа согласно API
 * @return {Object} объект с контекстом
 */
const createAuthorJSON = (body) => {
  const author = {
    owner: {
      username: body.username,
      tags: 'Искусство',
      avatar: img0,
      about: {
        image: img4,
        text: body.about,
      },
      isAuthor: true,
    },
    levels: [],
    posts: [],
  };
  return author;
};

/**
 * Функция, которая рендерит страницу профиля
 * @param {App} app Основной класс веб-приложения
 */
export default async (app) => {
  const params = new URL(window.location.href).searchParams;
  let id = params.get('id');
  if (id === null) {
    id = app.id;
  }
  const user = await app.api.getUser(id);

  if (!user.ok || user.status === 404) {
    app.main.innerHTML = errorTemplate({
      status: user.status,
      description: 'Ошибка',
      id: app.id,
      img: errorImg,
    });
    return;
  }

  app.main.innerHTML = navbarTemplate({
    user: {
      id: app.id,
      image: img0,
      logout: logoutIcon,
    },
  });

  let context;
  if (user.body.is_author) {
    const posts = await app.api.getAllPosts(user.body.id);
    if (!posts.ok) {
      app.main.innerHTML += errorTemplate({
        status: posts.status,
        description: 'Ошибка',
        id: app.id,
        img: errorImg,
      });
      return;
    }
    context = createAuthorJSON(user.body);
    posts.body.forEach(
        (post) => {
          const tmp = {
            image: img4,
            text: post.text,
            likesCount: 5,
            commentsCount: 15,
            likesIcon: likesIcon,
            commentIcon: commentIcon,
          };
          context.posts.push(tmp);
        },
    );
  } else {
    context = createDonaterJSON(user.body);
  }

  app.main.innerHTML += userTemplate(context);
};
