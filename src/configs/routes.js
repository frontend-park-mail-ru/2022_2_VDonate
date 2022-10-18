import profile from '@views/profile.js';
import login from '@views/login.js';
import signup from '@views/signup.js';
import logout from '@views/logout.js';

/**
 * Массив объектов с путем и функцией рендера страницы
 * @const {Array<Object>} routes
 */
const routes = [
  {
    path: /^\/(profile(\?id=\d+)?)?$/,
    render: profile,
  },
  {
    path: /^\/login$/,
    render: login,
  },
  {
    path: /^\/signup$/,
    render: signup,
  },
  {
    path: /^\/logout$/,
    render: logout,
  },
];
export default routes;
