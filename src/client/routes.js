import {
  path,
  filter,
  pathOr,
  compose,
  find,
  prop,
  reduce,
  toPairs,
} from 'ramda';
import Login from './components/Login';
import Companies from './components/Companies';
import People from './components/People';
import AddPeople from './components/People/Add';
import Agenda from './components/Agenda';
import Notes from './components/Notes';
import Missions from './components/Missions';
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
import { ADMIN_ROLE } from './utils/people';

const routes = {
  home: {
    path: '/',
    component: Companies,
    exact: true,
    auth: true,
    roles: [ADMIN_ROLE],
  },
  companies: {
    path: '/companies',
    component: Companies,
    exact: true,
    auth: true,
    roles: [ADMIN_ROLE],
  },
  addCompany: {
    path: '/companies/add',
    component: AddCompany,
    exact: true,
    auth: true,
    roles: [ADMIN_ROLE],
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
    roles: [ADMIN_ROLE],
  },
  addPeople: {
    path: '/people/add',
    exact: true,
    auth: true,
    component: AddPeople,
    roles: [ADMIN_ROLE],
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
    roles: [ADMIN_ROLE],
  },
  deletePerson: {
    roles: [ADMIN_ROLE],
  },
  editCompany: {
    path: '/company/edit/:id',
    component: EditCompany,
    exact: false,
    auth: true,
    roles: [ADMIN_ROLE],
  },
  deleteCompany: {
    roles: [ADMIN_ROLE],
  },
  agenda: {
    path: '/agenda',
    exact: true,
    auth: true,
    component: Agenda,
    default: true,
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
    roles: [ADMIN_ROLE],
  },
  addNotes: {
    path: '/notes/add',
    exact: true,
    auth: true,
    component: AddNotes,
    roles: [ADMIN_ROLE],
  },
  editNote: {
    path: '/note/edit/:id',
    exact: false,
    auth: true,
    component: EditNote,
    roles: [ADMIN_ROLE],
  },
  missions: {
    path: '/missions',
    exact: true,
    auth: true,
    component: Missions,
  },
  addMission: {},
  editMission: {},
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
  filter(prop('path')),
)(routes);
export const defaultRoute = find(prop('default'), exportedRoutes);
export const getRouteByName = name => routes[name];
export const getRouteByPath = path =>
  find(r => r.path === path, exportedRoutes);
export const getPathByName = (name, param) => {
  const path = prop('path', getRouteByName(name));
  return param ? `${path.replace(':id', param)}` : path;
};
export const getRouteRoles = name => path([name, 'roles'], routes);
export const isAuthRequired = route => route && (route.auth || route.roles);
export default exportedRoutes;
