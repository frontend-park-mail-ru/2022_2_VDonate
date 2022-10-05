/**
 * Модуль рендера страницы профиля
 * @module profile
 */

/**
 * Функция, создающая контекст для страницы профиля донатера
 * @param {Object} body объект ответа согласно API
 * @returns {Object} объект с контекстом
 */
const createDonaterJSON = body => {
  const donater = {
    owner: {
      username: body.username,
      tags: 'Донатер',
      avatar: "../static/img/0.jpg", //body.avatar,
      isAuthor: false
    },
    subscriptions: []
  }
  // body.userSubscriptions.forEach((sub) => {
  //   const tmp = {
  //     nickname: sub.name,
  //     level: `Уровень ${sub.level}`,
  //     avatar: sub.avatar, //"../static/img/1.jpg",
  //     link: `/profile?id=${sub.id}`
  //   };
  //   donater.subscriptions.push(tmp);
  // });
  return donater;
}

/**
 * Функция, создающая контекст для страницы профиля автора
 * @param {Object} body объект ответа согласно API
 * @returns {Object} объект с контекстом
 */
const createAuthorJSON = (router, body) => {
  const author = {
    owner: {
      username: body.username,
      tags: 'Искусство', // body.tag,
      avatar: "../static/img/0.jpg", // body.avatar, 
      isAuthor: true,
      about: {
        image: '../static/img/4.jpg', // body.descriptionImage
        text: body.about,
      },
    },
    levels: [],
    posts: []
  };
  // body.authorSubscriptions.forEach((sub) => {
  //   const tmp = {
  //     title: `Уровень ${sub.level}`,
  //     image: sub.image, //"../static/img/4.jpg",
  //     price: sub.price, //'₽500',
  //     priceDescribtion: sub.priceDescribtion, //'за неделю',
  //     text: sub.text // ['- мотивация', '- очень сильная мотивация'],
  //   };
  //   author.levels.push(tmp);
  // });
  router.api.getAllPosts(body.id).then(
    (body, status) => {
      if (status === 200) {
        body.posts.forEach((post) => {
          const tmp = {
            image: '../static/img/4.jpg', //post.workOfArt
            text: post.title,
            likesCount: 5, //5,
            commentsCount: 15 //15,
          };
          author.posts.push(tmp);
        })
      }
    }
  ) //обсудить сколько постов нам нужно

  return author;
}

/** 
 * Функция, которая рендерит страницу профиля
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default async (router) => {
  router.root.innerHTML = '';
  const params = new URL(location.href).searchParams;
  const id = params.get('id');
  const user = await router.api.getUser(id);

  if (user.status >= 400) {
    const errorEl = Handlebars.templates.error;
    router.root.innerHTML += errorEl({
      status: user.status,
      description: 'Ошибка',
      id: router.id,
    })
    return;
  }

  const navbarEl = Handlebars.templates.navbar;
  router.root.innerHTML += navbarEl({
    user: {
      id: router.id,
      image: '../static/img/0.jpg',
    }
  });

  const userEl = Handlebars.templates.user;

  router.root.innerHTML += userEl(user.body.is_author
    ? createAuthorJSON(router, user.body)
    : createDonaterJSON(user.body));

  const footerEl = Handlebars.templates.footer;
  router.root.innerHTML += footerEl();
}
