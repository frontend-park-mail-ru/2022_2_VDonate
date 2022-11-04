export enum Pages {
  PRELOAD,
  NOT_FOUND,
  LOGIN,
  SIGNUP,
  LOGOUT,
  PROFILE,
  SEARCH,
  FEED,
}

export interface RouteType {
  path: RegExp
  type: Pages
}

export const routes: RouteType[] = [
  // {
  //   path: /^\/(profile(\?id=\d+)?)?$/,
  //   render: profile,
  // },
  {
    path: /^\/login$/,
    type: Pages.LOGIN,
  },
  // {
  //   path: /^\/signup$/,
  //   render: signup,
  // },
  // {
  //   path: /^\/logout$/,
  //   render: logout,
  // },
];
