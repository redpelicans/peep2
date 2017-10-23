import { path, filter, compose, find, prop, reduce, toPairs } from 'ramda';

import Login from './components/Login';
import Companies from './components/Companies';
import People from './components/People';
import Agenda from './components/Agenda';
import NotFound from './components/NotFound';
import Notes from './components/Notes';
import Missions from './components/Missions';

import AddPeople from './components/People/Add';
import EditMission from './components/Missions/Edit';
import AddMission from './components/Missions/Add';
import AddCompany from './components/Companies/Add';
import AddAgenda from './components/Agenda/Add';
import AddNotes from './components/Notes/Add';

import EditAgenda from './components/Agenda/Edit';
import EditPerson from './components/People/Edit';
import EditNote from './components/Notes/Edit';
import EditCompany from './components/Companies/Edit';

import PersonView from './components/People/View';
import CompanyView from './components/Companies/View';
import MissionView from './components/Missions/View';

import { ADMIN_ROLE, isAdmin } from './utils/people';

const NoteEditTest = ({ user, note = {} }) => {
  return note.authorId === user._id || isAdmin(user);
};

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
    exact: true,
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
    exact: true,
    auth: true,
  },
  editPerson: {
    path: '/person/edit/:id',
    component: EditPerson,
    exact: true,
    auth: true,
    roles: [ADMIN_ROLE],
  },
  deletePerson: {
    roles: [ADMIN_ROLE],
  },
  editCompany: {
    path: '/company/edit/:id',
    component: EditCompany,
    exact: true,
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
  addNote: {
    path: '/notes/add',
    exact: true,
    auth: true,
    component: AddNotes,
    roles: [ADMIN_ROLE],
  },
  editNote: {
    path: '/note/edit/:id',
    exact: true,
    auth: true,
    component: EditNote,
    test: NoteEditTest,
  },
  deleteNote: {
    test: NoteEditTest,
  },
  missions: {
    path: '/missions',
    exact: true,
    auth: true,
    component: Missions,
    roles: [ADMIN_ROLE],
  },
  addMission: {
    path: '/missions/add',
    exact: true,
    auth: true,
    component: AddMission,
    roles: [ADMIN_ROLE],
  },
  editMission: {
    path: '/mission/edit/:id',
    exact: true,
    auth: true,
    component: EditMission,
    roles: [ADMIN_ROLE],
  },
  mission: {
    path: '/missions/:id',
    exact: true,
    auth: true,
    component: MissionView,
    roles: [ADMIN_ROLE],
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
export const getRouteProp = prop => name => path([name, prop], routes);
export const getRouteRoles = getRouteProp('roles');
export const getRouteTest = getRouteProp('test');
export const getRouteAuthProps = name => ({
  roles: getRouteRoles(name),
  test: getRouteTest(name),
});

export const isAuthRequired = route => route && (route.auth || route.roles);
export default exportedRoutes;
