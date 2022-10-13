/**
 * Модуль рендера страницы профиля
 * @module profile
 */

import errorTemplate from '@template/error.handlebars';
import navbarTemplate from '@template/navbar.handlebars';
import userTemplate from '@template/user.handlebars';

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
      avatar: '../static/img/0.jpg',
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
      avatar: '../static/img/0.jpg',
      about: {
        image: '../static/img/4.jpg',
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
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default async (router) => {
  router.main.innerHTML = '';
  const params = new URL(window.location.href).searchParams;
  let id = params.get('id');
  if (id === null) {
    id = router.id;
  }
  const user = await router.api.getUser(id);

  if (!user.ok) {
    router.main.innerHTML += errorTemplate({
      status: user.status,
      description: 'Ошибка',
      id: router.id,
    });
    return;
  }

  router.main.innerHTML += navbarTemplate({
    user: {
      id: router.id,
      image: '../static/img/0.jpg',
    },
  });

  let context;
  if (user.body.is_author) {
    const posts = await router.api.getAllPosts(user.body.id);
    if (!posts.ok) {
      router.main.innerHTML += errorTemplate({
        status: posts.status,
        description: 'Ошибка',
        id: router.id,
      });
      return;
    }
    context = createAuthorJSON(user.body);
    posts.body.forEach(
        (post) => {
          const tmp = {
            image: '../static/img/4.jpg',
            text: post.title,
            likesCount: 5,
            commentsCount: 15,
          };
          context.posts.push(tmp);
        },
    );
  } else {
    context = createDonaterJSON(user.body);
  }

  router.main.innerHTML += userTemplate(context);
};
