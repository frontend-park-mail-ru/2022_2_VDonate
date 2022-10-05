/**
 * Модуль рендера страницы профиля
 * @module profile
 */

/**
 * Функция, создающая контекст для страницы профиля донатера
 * @param {Router} router класс маршрутизации
 * @returns {Object} объект с контекстом
 */
function createDonaterJSON(body) {
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
 * @param {Router} router класс маршрутизации
 * @param {string} id id автора
 * @returns {Object} объект с контекстом
 */
function createAuthorJSON(body) {
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
  // const recievedPosts = await router.api.getAllPosts(1, 20, id); //обсудить сколько постов нам нужно
  // recievedPosts.body.posts.forEach((post) => {
  //   const tmp = {
  //     image: post.workOfArt, //'../static/img/4.jpg',
  //     text: post.about,
  //     likesCount: post.likes, //5,
  //     commentsCount: post.comments //15,
  //   };
  //   author.posts.push(tmp);
  // });
  return author;
}

/**
 * 
 * @param {int} id 
 * @param {Router} router 
 */
async function createUserContext(id, router) {
  const user = await router.api.getUser(id);
  if (user.body.isAuthor) {
    return createAuthorJSON(user.body);
  }
  return createDonaterJSON(user.body);
}


/** 
 * Функция, которая рендерит страницу профиля
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default async (router) => {
  const params = new URL(location.href).searchParams;
  const id = params.get('id');
  const navbar = Handlebars.templates.navbar;
  router.root.innerHTML = '';
  router.root.innerHTML += navbar();

  const user = Handlebars.templates.user;

  // if (id === null) {
  //   const donater = createDonaterJSON(router);
  //   router.root.innerHTML += user(donater);
  // } else {
  //   const author = createAuthorJSON(router, id);
  //   router.root.innerHTML += user(author);
  // }

  createUserContext(id, router).then(context => {
    router.root.innerHTML += user(context);
  })

  const footer = Handlebars.templates.footer;
  router.root.innerHTML += footer();
}
