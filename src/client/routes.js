import { compose, find, values, prop, reduce, toPairs } from 'ramda';
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
    component: Companies,
    default: true,
    exact: true,
    auth: true,
  },
  people: {
    path: '/people',
    exact: true,
    auth: true,
    component: People,
  },
  agenda: {
    path: '/agenda',
    exact: true,
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
export const defaultRoute = compose(find(prop('default')), values)(routes);
export const getRoute = name => routes[name];
export default exportedRoutes;
