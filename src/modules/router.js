import profile from "../views/profile.js";
import auth from "../views/auth.js";
import sign from "../views/sign.js";
import render404 from "../views/404.js";
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

export default class Router {

    constructor(root, api) {
        this.api = api;
        this.root = root;
        window.addEventListener('click', (e) => {
            const target = e.target.closest("a[data-link]");
            if (target != null) {
                e.preventDefault();
                console.log(target);
                this.goTo(target.getAttribute('href'));
            }
        });

        window.addEventListener('popstate', (e)=> {
            const route = routes.find(obj => window.location.pathname.match(obj.path));
            if (route != undefined) {
                route.render(this);
            }
        })

        const res = api.authUser();
        if (res.status === "200") {
            this.id = res.body.id;
            this.goTo('/profile');    
        } else {
            this.id = null;
            this.goTo('/auth/login');
        }
    }

    goTo(loc) { 
        console.log(loc);
        const route = routes.find(obj => loc.match(obj.path));
        console.log(route);
        if (route === undefined) {
            // может не сработать
            // document.location.href = href;
            render404();
            return;
        }
        window.history.pushState(null, null, loc);
        route.render(this);
    }
}
