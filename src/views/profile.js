async function createDonaterJSON(router) {
  const res = await router.api.getUser(router.id);
  let donater = {
    owner: {
      nickname: res.body.username,
      tags: 'Донатер',
      avatar: res.body.avatar, // "../static/img/0.jpg",
      isAuthor: false
    },
    subscriptions: []
  }
  res.body.userSubscriptions.forEach((sub) => {
    const tmp = {
      nickname: sub.name,
      level: `Уровень ${sub.level}`,
      avatar: sub.avatar, //"../static/img/1.jpg",
      link: `/profile?id=${sub.id}`
    };
    donater.subscriptions.push(tmp);
  });
}

async function createAuthorJSON(router, id) {
  const res = await router.api.getUser(id);
  let author = {
    owner: {
      nickname: res.body.user,
      tags: res.body.tag, //'Искусство',
      avatar: res.body.avatar, // "../static/img/0.jpg",
      isAuthor: true
    },
    levels: [],
    description: {
      image: res.body.descriptionImage,//'../static/img/4.jpg',
      text: res.body.about,
    },
    posts: []
  };
  res.body.authorSubscriptions.forEach((sub) => {
    const tmp = {
      title: `Уровень ${sub.level}`,
      image: sub.image, //"../static/img/4.jpg",
      price: sub.price, //'₽500',
      priceDescribtion: sub.priceDescribtion, //'за неделю',
      text: sub.text // ['- мотивация', '- очень сильная мотивация'],
    };
    author.levels.push(tmp);
  });
  const recievedPosts = await router.api.getAllPosts(1, 20, id); //обсудить сколько постов нам нужно
  recievedPosts.body.posts.forEach((post) => {
    const tmp = {
      image: post.workOfArt, //'../static/img/4.jpg',
      text: post.about,
      likesCount: post.likes, //5,
      commentsCount: post.comments //15,
    };
    author.posts.push(tmp);
  });
  return author;
}

export default async (router) => {
  const params = new URL(location.href).searchParams;
  const id = params.get('id');
  const header = Handlebars.templates.header;
  router.root.innerHTML = '';
  router.root.innerHTML += header({ link: '/profile' });

  const main = Handlebars.templates.main;
  const el = document.createElement('div');
  el.id = 'main';
  el.className = 'main';

  if (id === null) {
    const donater = createDonaterJSON(router);
    el.innerHTML += main(donater);
  } else {
    const author = createAuthorJSON(router, id);
    el.innerHTML += main(author);
  }
  router.root.appendChild(el);

  const footer = Handlebars.templates.footer;
  router.root.innerHTML += footer();
}