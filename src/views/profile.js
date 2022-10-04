/**
 * Модуль рендера страницы профиля
 * @module profile
 */

/**
 * Функция, создающая контекст для страницы профиля донатера
 * @param {Router} router класс маршрутизации
 * @returns {Object} объект с контекстом
 */
async function createDonaterJSON(router) {
  const res = await router.api.getUser(router.id);
  const donater = {
    owner: {
      username: res.body.username,
      tags: 'Донатер',
      avatar: "../static/img/0.jpg", //res.body.avatar,
      isAuthor: false
    },
    subscriptions: []
  }
  // res.body.userSubscriptions.forEach((sub) => {
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
async function createAuthorJSON(router, id) {
  const res = await router.api.getUser(id);
  const author = {
    owner: {
      username: res.body.username,
      tags: 'Искусство',//res.body.tag,
      avatar: "../static/img/0.jpg",// res.body.avatar, 
      isAuthor: true,
      about: {
        image: '../static/img/4.jpg', // res.body.descriptionImage
        text: res.body.about,
      },
    },
    levels: [],
    posts: []
  };
  // res.body.authorSubscriptions.forEach((sub) => {
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
 * Функция, которая рендерит страницу профиля
 * @param {Router} router Класс маршрутизации по страницам сайта
 */
export default async (router) => {
  const params = new URL(location.href).searchParams;
  const id = params.get('id');
  const header = Handlebars.templates.header;
  router.root.innerHTML = '';
  router.root.innerHTML += header();

  const user = Handlebars.templates.user;

  if (id === null) {
    const donater = createDonaterJSON(router);
    router.root.innerHTML += user(donater);
  } else {
    const author = createAuthorJSON(router, id);
    router.root.innerHTML += user(author);
  }

  const footer = Handlebars.templates.footer;
  router.root.innerHTML += footer();
}
