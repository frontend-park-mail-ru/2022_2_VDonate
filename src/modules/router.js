/**
 * Модуль маршрутизации по страницам сайта
 * @module Router
 */
import profile from "../views/profile.js";
import login from "../views/login.js";
import signup from "../views/signup.js";
import render404 from "../views/404.js";

/**
 * Массив объектов с путем и функцией рендера страницы
 * @const {Array<Object>} routes
 */
const routes = [
    {
        path: /^\/profile(\?id=\d+)?$/,
        render: profile,
    },
    {
        path: /^\/login$/,
        render: login
    },
    {
        path: /^\/signup$/,
        render: signup
    },

]

/**Класс маршрутизации по страницам сайта */
export default class Router {
    static _instance = null;
    /**
     * Конструктор, добавляющий обработку 2 событий: переход между страницами и переход вперед/назад
     * и при входе на сайт запускает процесс аутенфикации
     * @constructor
     * @param {Element} root указатель на блок, куда будет рендериться страница 
     * @param {Api} api API связи с сервером
     */
    constructor() {
        if (Router._instance === null) {
            Router._instance = this;
            window.addEventListener('click', (e) => {
                const target = e.target.closest("a[data-link]");
                if (target != null) {
                    e.preventDefault();
                    this.goTo(target.getAttribute('href'));
                }
            });

            window.addEventListener('popstate', (e) => {
                const route = routes.find(obj => window.location.pathname.match(obj.path));
                if (route != undefined) {
                    route.render(this);
                }
            });
            return this;
        }
        return Router._instance;
    }

    get root() {
        return this._root;
    }

    set root(value) {
        this._root = value;
    }

    get api() {
        return this._api;
    }

    set api(value) {
        this._api = value;
    }

    userAuth() {
        this.api.authUser()
            .then(({ status, body }) => {
                if (status === 200) {
                    this.id = body.id;
                    this.goTo(`/profile?id=${body.id}`);
                } else {
                    this.goTo('/login');
                }
            })
            .catch(({ status, body }) => {
                this.goTo('/login');
            });
    }

    /**
     * Функция, которая вызывает рендер страницы по переданому пути
     * @param {string} loc путь страницы
     */
    goTo(loc) {
        console.log(loc);
        const route = routes.find(obj => loc.match(obj.path));
        console.log(route);
        if (route === undefined) {
            render404();
            return;
        }
        window.history.pushState(null, null, loc);
        route.render(this);
    }
}