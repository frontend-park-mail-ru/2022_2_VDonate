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
  {
    path: /^\/(profile(\?id=\d+)?)?$/,
    type: Pages.PROFILE,
  },
  {
    path: /^\/login$/,
    type: Pages.LOGIN,
  },
  {
    path: /^\/signup$/,
    type: Pages.SIGNUP,
  },
  // {
  //   path: /^\/logout$/,
  //   render: logout,
  // },
];
