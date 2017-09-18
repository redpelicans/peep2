import { compose, find, prop, reduce, toPairs } from 'ramda';
import Login from './components/Login';
import Companies from './components/Companies';
import People from './components/People';
import Agenda from './components/Agenda';

const routes = {
  home: {
    path: '/',
    component: Companies,
    exact: true,
    auth: true,
  },
  companies: {
    path: '/companies',
    menuOrder: 1,
    component: Companies,
    default: true,
    exact: true,
    auth: true,
  },
  people: {
    path: '/people',
    exact: true,
    menuOrder: 2,
    auth: true,
    component: People,
  },
  agenda: {
    path: '/agenda',
    exact: true,
    menuOrder: 0,
    auth: true,
    component: Agenda,
  },
  login: {
    path: '/login',
    exact: true,
    component: Login,
  },
};

const exportedRoutes = compose(reduce((acc, [name, r]) => [...acc, { ...r, name }], []), toPairs)(routes);
export const defaultRoute = find(prop('default'), exportedRoutes);
export const getRoute = name => routes[name];
export const getRouteByPath = path => find(r => r.path === path, exportedRoutes);
export default exportedRoutes;
