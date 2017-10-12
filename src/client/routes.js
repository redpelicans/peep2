import { compose, find, prop, reduce, toPairs } from 'ramda';
import Login from './components/Login';
import Companies from './components/Companies';
import People from './components/People';
import AddPeople from './components/People/Add';
import Agenda from './components/Agenda';
import Notes from './components/Notes';
import AddCompany from './components/Companies/Add';
import AddAgenda from './components/Agenda/Add';
import EditAgenda from './components/Agenda/Edit';
import PersonView from './components/People/View';
import CompanyView from './components/Companies/View';
import EditCompany from './components/Companies/Edit';
import EditPerson from './components/People/Edit';
import EditNote from './components/Notes/Edit';
import AddNotes from './components/Notes/Add';
import NotFound from './components/NotFound';

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
  addCompany: {
    path: '/companies/add',
    component: AddCompany,
    exact: true,
    auth: true,
  },
  company: {
    path: '/companies/:id',
    component: CompanyView,
    exact: false,
    auth: true,
  },
  people: {
    path: '/people',
    exact: true,
    auth: true,
    component: People,
  },
  addPeople: {
    path: '/people/add',
    exact: true,
    auth: true,
    component: AddPeople,
  },
  person: {
    path: '/people/:id',
    component: PersonView,
    exact: false,
    auth: true,
  },
  editPerson: {
    path: '/person/edit/:id',
    component: EditPerson,
    exact: false,
    auth: true,
  },
  editCompany: {
    path: '/company/edit/:id',
    component: EditCompany,
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
  editAgendaEvent: {
    path: '/agenda/editevent/:id',
    exact: true,
    auth: true,
    component: EditAgenda,
  },

  notes: {
    path: '/notes',
    exact: true,
    auth: true,
    component: Notes,
  },
  addNotes: {
    path: '/notes/add',
    exact: true,
    auth: true,
    component: AddNotes,
  },
  editNote: {
    path: '/note/edit/:id',
    exact: false,
    auth: true,
    component: EditNote,
  },
  login: {
    path: '/login',
    exact: true,
    component: Login,
  },
  notfound: {
    path: '/notfound',
    exact: true,
    component: NotFound,
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
  return param ? `${path.replace(':id', param)}` : path;
};
export default exportedRoutes;
