/**
 * Модуль маршрутизации по страницам сайта
 * @module Router
 */
import profile from "../views/profile.js";
import auth from "../views/auth.js";
import sign from "../views/sign.js";
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
        path: /^\/auth\/login$/,
        render: auth
    },
    {
        path: /^\/auth\/signup$/,
        render: sign
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
        const res = api.authUser();
        if (res.status === "200") {
            this.id = res.body.id;
            this.goTo('/profile');
        } else {
            this.id = null;
            this.goTo('/auth/login');
        }
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