import profile from "../views/profile.js";
import auth from "../views/auth.js";
import sign from "../views/sign.js";
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
    }
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
        this.goTo('/profile');
    }
    goTo(loc) {
        console.log(loc);
        const route = routes.find(obj => loc.match(obj.path));
        console.log(route);
        if (route === undefined) {
            // может не сработать
            // document.location.href = href;

            return;
        }
        window.history.pushState(null, null, loc);
        // console.log(route);
        route.render(this);
    }
}
