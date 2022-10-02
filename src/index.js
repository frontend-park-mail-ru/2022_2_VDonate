'use_strict'

import Router from './modules/router.js';
import Api from './modules/api.js';

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

/**
 * @const {*} api класс интерфейса для связи с сервером
 */
const api = new Api('http://192.168.137.17:8080/api/v1');

const footer = Handlebars.templates.footer;
document.getElementById("entry").innerHTML += footer();
