import { compose, find, prop, reduce, toPairs } from 'ramda';
import Login from './components/Login';
import Companies from './components/Companies';
import People from './components/People';
import Agenda from './components/Agenda';
import Notes from './components/Notes';
import AddCompany from './components/Companies/Add';
import AddAgenda from './components/Agenda/Add';
import PersonView from './components/People/View';
import CompanyView from './components/Companies/View';
import Edit from './components/Edit';

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
  company: {
    path: '/company/:id',
    component: CompanyView,
    default: true,
    exact: false,
    auth: true,
  },
  editCompany: {
    path: '/edit/company',
    component: Edit, // TO BE CHANGED
    default: true,
    exact: false,
    auth: true,
  },
  addCompagny: {
    path: '/companies/add',
    component: AddCompany,
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
  person: {
    path: '/person/:id',
    component: PersonView,
    default: true,
    exact: false,
    auth: true,
  },
  editPerson: {
    path: '/edit/person',
    component: Edit, // TO BE CHANGED
    default: true,
    exact: false,
    auth: true,
  },
  agenda: {
    path: '/agenda',
    exact: true,
    auth: true,
    component: Agenda,
  },
  addAgendaEvent: {
    path: '/agenda/addevent',
    exact: true,
    auth: true,
    component: AddAgenda,
  },
  notes: {
    path: '/notes',
    exact: true,
    auth: true,
    component: Notes,
  },
  editNote: {
    path: 'edit/note',
    exact: false,
    auth: true,
  },
  login: {
    path: '/login',
    exact: true,
    component: Login,
  },
};

const exportedRoutes = compose(
  reduce((acc, [name, r]) => [...acc, { ...r, name }], []),
  toPairs,
)(routes);
export const defaultRoute = find(prop('default'), exportedRoutes);
export const getRouteByName = name => routes[name];
export const getRouteByPath = path =>
  find(r => r.path === path, exportedRoutes);
export const getPathByName = (name, param) => {
  const path = prop('path', getRouteByName(name));
  return param ? `${path}/param` : path;
};
export default exportedRoutes;
