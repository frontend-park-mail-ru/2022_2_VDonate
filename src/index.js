'use_strict'

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
    },
    {
      nickname: 'ЯМогучий',
      level: 'Уровень 5',
      avatar: "../static/img/2.jpg",
    },
    {
      nickname: 'Красная Шапочка',
      level: 'Уровень 1 000 000',
      avatar: "../static/img/3.jpg",
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
      image: "../static/img/4.jpg",
      price: '₽2000',
      priceDescribtion: 'за неделю',
      text: [
        '- мотивация',
        '- очень сильная мотивация'
      ],
    },
    {
      title: 'Уровень 300',
      image: "../static/img/4.jpg",
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

const header = Handlebars.templates.header;
document.getElementById("entry").innerHTML += header();

const main = Handlebars.templates.main;
document.getElementById("entry").innerHTML += main(contextAuthor);
