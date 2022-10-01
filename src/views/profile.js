const bigText = 'Прежде всего, синтетическое тестирование не оставляет шанса \
                для дальнейших направлений развития. Идейные соображения \
                высшего порядка, а также экономическая повестка сегодняшнего \
                дня является качественно новой ступенью анализа существующих \
                паттернов поведения. С другой стороны, постоянное \
                информационно-пропагандистское обеспечение нашей деятельности \
                способствует повышению качества глубокомысленных рассуждений. \
                Как принято считать, действия представителей оппозиции освещают \
                чрезвычайно интересные особенности картины в целом, однако \
                конкретные выводы, разумеется, представлены в исключительно \
                положительном свете.';

const contextDonater = {
    owner: {
      nickname: 'The Best Subscriber',
      tags: 'Донатер',
      avatar: "../static/img/0.jpg",
      isAuthor: false
    },
    subscriptions: [
      {
        nickname: 'Кодзима Гений',
        level: 'Уровень 1',
        avatar: "../static/img/1.jpg",
        link: '/profile?id=1',
      },
      {
        nickname: 'ЯМогучий',
        level: 'Уровень 5',
        avatar: "../static/img/2.jpg",
        link: '/profile?id=2',
      },
      {
        nickname: 'Красная Шапочка',
        level: 'Уровень 1 000 000',
        avatar: "../static/img/3.jpg",
        link: '/profile?id=3',
      },
    ]
  };
  
  const contextAuthor = {
    owner: {
      nickname: 'Кодзима Гений',
      tags: 'Искусство',
      avatar: "../static/img/1.jpg",
      isAuthor: true
    },
    levels: [
      {
        title: 'Уровень 1',
        image: "../static/img/4.jpg",
        price: '₽500',
        priceDescribtion: 'за неделю',
        text: [
          '- мотивация',
          '- очень сильная мотивация'
        ],
      },
      {
        title: 'Уровень 2',
        image: "../static/img/5.jpg",
        price: '₽2000',
        priceDescribtion: 'за неделю',
        text: [
          '- мотивация',
          '- очень сильная мотивация'
        ],
      },
      {
        title: 'Уровень 300',
        image: "../static/img/6.jpg",
        price: '₽1 000 000',
        priceDescribtion: 'за неделю',
        text: [
          '- мотивация',
          '- очень сильная мотивация'
        ],
      },
    ],
    description: {
      image: '../static/img/4.jpg',
      text: bigText,
    },
    posts: [
      {
        image: '../static/img/4.jpg',
        text: bigText + bigText,
        likesCount: 5,
        commentsCount: 15,
      },
      {
        image: '../static/img/2.jpg',
        text: bigText,
        likesCount: 10,
        commentsCount: 3,
      },
    ],
  };
  

export default async (router) => {
    const params = new URL(location.href).searchParams;
    const id = params.get('id');
    const header = Handlebars.templates.header;
    router.root.innerHTML = '';
    router.root.innerHTML += header({ link: '/profile' });

    const main = Handlebars.templates.main;
    const el = document.createElement('div');
    el.id = 'main';
    el.className= 'main';

    if (id===null) {
        el.innerHTML += main(contextDonater);
    } else {
        const res = await router.api.getUser(id);
        contextAuthor.owner.nickname = res.body.username;
        contextAuthor.description.text = res.body.about;
        el.innerHTML += main(contextAuthor);
    }
    router.root.appendChild(el);

    const footer = Handlebars.templates.footer;
    router.root.innerHTML += footer();
}