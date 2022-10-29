'use_strict';

// import App from '@modules/app';
import './style.styl';

import {Post} from '@models/post/post.ts';
import avatarImage from '@img/1.jpg';

import {Sub} from '@models/sub/sub.ts';
import subImg from '@img/2.jpg';
import menuIcon from '@icon/menu.svg';
import {LeftNavbar} from '@models/navbar/left/left_navbar.ts';
import {RightNavbar, NavbarType} from '@models/navbar/right/right_navbar.ts';
import {About} from '@models/about/about.ts';

/**
 * Основной класс веб-приложения
 * @const {App} app
 */
// const app = new App();
// app.authUser();
const main = document.getElementById('main');


const testPost = {
  post_id: '1',
  author: {
    img: avatarImage,
    username: 'User_test',
  },
  date: new Date().toLocaleDateString(),
  content: `Прежде всего, синтетическое тестирование не оставляет шанса \
  для дальнейших направлений развития. Идейные соображения \
  высшего порядка, а также экономическая повестка сегодняшнего \
  дня является качественно новой ступенью анализа существующих \
  паттернов поведения. С другой стороны, постоянное \
  информационно-пропагандистское обеспечение нашей деятельности \
  способствует повышению качества глубокомысленных рассуждений. \
  Как принято считать, действия представителей оппозиции освещают \
  чрезвычайно интересные особенности картины в целом, однако \
  конкретные выводы, разумеется, представлены в исключительно \
  положительном свете.`,
  likeCount: '315',
  like: true,
  commentCount: '400',
};

const testSub = {
  id: '1',
  subName: 'Элитная подписка',
  lvl: '1',
  img: subImg,
  price: '2000',
  period: 'за неделю',
  motivation: `Участие в розыгрышах<br>
  Доступ к эксклюзивным семплам<br>
  Материалы со стримов <br>
  Запись стримов<br>
  Эксклюзивные посты<br>
  30 минутный разговор<br>
  Что-нибудь еще<br>
  Третье<br>
  Десятое<br>
  Сто двадцать пятое`,
};

const navbarLinkTest = [
  {
    icon: menuIcon,
    text: 'Лента',
    choosen: true,
  },
  {
    icon: menuIcon,
    text: 'Поиск',
    choosen: false,
  },
  {
    icon: menuIcon,
    text: 'Подписки',
    choosen: false,
  },
];

const navbarSubTest = [
  {
    img: avatarImage,
    username: 'Кодзима гений',
    id: '1',
  },
  {
    img: avatarImage,
    username: 'Кодзима гений',
    id: '1',
  },
  {
    img: avatarImage,
    username: 'Кодзима гений',
    id: '1',
  },
  {
    img: avatarImage,
    username: 'Кодзима гений',
    id: '1',
  },
];

const navbarProfileTest = {
  img: avatarImage,
  username: 'Кодзима гений',
  id: '1',
  is_author: true,
};

const navbar = new LeftNavbar(navbarLinkTest, navbarSubTest, navbarProfileTest);
main.appendChild(navbar.element);

const rightNavbar = {
  img: avatarImage,
  username: 'Кадзима',
  subscriptions: '1040',
  is_author: true,
  subscribers: '4322',
};

let nav = new RightNavbar(NavbarType.feed, rightNavbar);
main.appendChild(nav.element);

nav = new RightNavbar(NavbarType.profile, rightNavbar);
main.appendChild(nav.element);

const man = document.createElement('div');
man.setAttribute('style', `margin-left: 320px;`);
main.appendChild(man);

const lev = document.createElement('div');
lev.setAttribute('style', `
display: flex;
flex-direction: row;
gap: 40px;
`);

const sub = new Sub(testSub);
lev.appendChild(sub.element);
man.appendChild(lev);

const about = new About(testPost.content);
man.appendChild(about.element);

const post = new Post(testPost);
man.appendChild(post.element);

import {SignLog, SignLogType} from '@models/signlog/signlog.ts';

import {InputType} from '@components/input/input.ts';

const logTest = [
  {
    inputType: InputType.username,
    context: {
      label: 'Псевдоним',
      placeholder: 'Введите свой псеводим',
      name: 'хз',
    },
  },
  {
    inputType: InputType.password,
    context: {
      label: 'Пароль',
      placeholder: 'Введите свой пароль',
      name: 'ххзз',
    },
  },
];

const signTest = [
  {
    inputType: InputType.email,
    context: {
      label: 'Почта',
      placeholder: 'Введите свою почту',
      name: 'хз',
    },
  },
  {
    inputType: InputType.username,
    context: {
      label: 'Псевдоним',
      placeholder: 'Введите свой псеводим',
      name: 'хз',
    },
  },
  {
    inputType: InputType.password,
    context: {
      label: 'Пароль',
      placeholder: 'Введите свой пароль',
      name: 'ххзз',
    },
  },
  {
    inputType: InputType.password,
    context: {
      label: 'Повторите пароль',
      placeholder: 'Введите свой пароль',
      name: 'ххзз',
    },
  },
];
let sgn = new SignLog(SignLogType.login, logTest);
main.appendChild(sgn.element);
sgn = new SignLog(SignLogType.signup, signTest);
main.appendChild(sgn.element);
