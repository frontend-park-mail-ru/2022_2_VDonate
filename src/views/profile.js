/**
 * Модуль рендера страницы профиля
 * @module profile
 */

/**
 * Функция, создающая контекст для страницы профиля донатера
 * @param {Object} body объект ответа согласно API
 * @returns {Object} объект с контекстом
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
 * @returns {Object} объект с контекстом
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
  router.root.innerHTML = '';
  const params = new URL(window.location.href).searchParams;
  const id = params.get('id');
  const user = await router.api.getUser(id);

  if (user.status >= 400) {
    const errorEl = Handlebars.templates.error;
    router.root.innerHTML += errorEl({
      status: user.status,
      description: 'Ошибка',
      id: router.id,
    });
    return;
  }

  const navbarEl = Handlebars.templates.navbar;
  router.root.innerHTML += navbarEl({
    user: {
      id: router.id,
      image: '../static/img/0.jpg',
    },
  });

  const userEl = Handlebars.templates.user;

  let context;
  if (user.body.is_author) {
    const posts = await router.api.getAllPosts(user.body.id);
    if (posts.status >= 400) {
      const errorEl = Handlebars.templates.error;
      router.root.innerHTML += errorEl({
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

  router.root.innerHTML += userEl(context);

  const footerEl = Handlebars.templates.footer;
  router.root.innerHTML += footerEl();
};
