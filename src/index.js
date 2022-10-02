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
    username: 'The Best Subscriber',
    tags: 'Донатер',
    avatar: "../static/img/0.jpg",
    isAuthor: false
  },
  subscriptions: [
    {
      username: 'Кодзима Гений',
      levelName: 'Уровень 1',
      avatar: "../static/img/1.jpg",
      link: '/profile?id=1',
    },
    {
      username: 'ЯМогучий',
      levelName: 'Уровень 5',
      avatar: "../static/img/2.jpg",
      link: '/profile?id=2',
    },
    {
      username: 'Красная Шапочка',
      levelName: 'Уровень 1 000 000',
      avatar: "../static/img/3.jpg",
      link: '/profile?id=3',
    },
  ]
};

const contextAuthor = {
  owner: {
    username: 'Кодзима Гений',
    tags: 'Искусство',
    avatar: "../static/img/1.jpg",
    isAuthor: true,
    about: {
      image: '../static/img/4.jpg',
      text: bigText,
    },
  },
  levels: [
    {
      levelName: 'Уровень 1',
      image: "../static/img/4.jpg",
      price: '₽500',
      priceDescribtion: 'за неделю',
      descriptions: [
        '- мотивация',
        '- очень сильная мотивация'
      ],
    },
    {
      levelName: 'Уровень 2',
      image: "../static/img/5.jpg",
      price: '₽2000',
      priceDescribtion: 'за неделю',
      descriptions: [
        '- мотивация',
        '- очень сильная мотивация'
      ],
    },
    {
      levelName: 'Уровень 300',
      image: "../static/img/6.jpg",
      price: '₽1 000 000',
      priceDescribtion: 'за неделю',
      descriptions: [
        '- мотивация',
        '- очень сильная мотивация'
      ],
    },
  ],
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

const contextLogIn = {
  formTitle: 'Вход',
  formName: 'login',
  inputs: [
    {
      title: 'Почта',
      name: 'email',
      type: 'text',
    },
    {
      title: 'Пароль',
      name: 'password',
      type: 'password',
    },
  ],
  buttonTittle: 'Войти',
  orButton: {
    title: 'Зарегистрироваться',
    link: '/signup',
  }
};

const contextSignUp = {
  formTitle: 'Регистрация',
  formName: 'signup',
  inputs: [
    {
      title: 'Почта',
      name: 'email',
      type: 'text',
    },
    {
      title: 'Никнейм',
      name: 'username',
      type: 'text',
    },
    {
      title: 'Пароль',
      name: 'password',
      type: 'password',
    },
    {
      title: 'Повторите пароль',
      name: 'passwordRepeat',
      type: 'password',
    },
  ],
  buttonTittle: 'Зарегистрироваться',
  orButton: {
    title: 'Войти',
    link: '/signin',
  }
};

const contextNav = {
  user: {
    image: '../static/img/0.jpg',
    id: 0,
  },
}

// const navbar = Handlebars.templates.navbar;
// document.getElementById("entry").innerHTML += navbar(contextNav);

// const main = Handlebars.templates.user;
// document.getElementById("entry").innerHTML += main(contextAuthor);

const signlog = Handlebars.templates.signlog;
document.getElementById("entry").innerHTML += signlog(contextSignUp);

const footer = Handlebars.templates.footer;
document.getElementById("entry").innerHTML += footer();
