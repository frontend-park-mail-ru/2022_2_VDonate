var source = document.getElementById("entry-template").innerHTML;
var template = Handlebars.compile(source);

var context = {
  owner: {
    name: 'The Best Subscriber',
    tags: 'Донатер',
    image: "../static/img/0.jpg",
  },
  subscriptions: [
    {
      name: 'Кодзима Гений',
      level: 'Уровень 1',
      image: "../static/img/1.jpg",
    },
    {
      name: 'ЯМогучий',
      level: 'Уровень 5',
      image: "../static/img/2.jpg",
    },
    {
      name: 'Красная Шапочка',
      level: 'Уровень 1 000 000',
      image: "../static/img/3.jpg",
    },
  ]
};
var html = template(context);

document.getElementById("entry").innerHTML += html