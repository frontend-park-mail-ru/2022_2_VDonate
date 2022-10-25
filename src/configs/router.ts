import login from '@views/loginPage';
import notFoundPage from '@views/notFoundPage';

const routes = {
  certain: [
  // {
  //   path: /^\/(profile(\?id=\d+)?)?$/,
  //   render: profile,
  // },
    {
      path: /^\/login$/,
      render: login,
    },
  // {
  //   path: /^\/signup$/,
  //   render: signup,
  // },
  // {
  //   path: /^\/logout$/,
  //   render: logout,
  // },
  ],
  uncertain: notFoundPage,
};
export default routes;
