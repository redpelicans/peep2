import Login from './components/Login';
import Companies from './components/Companies';

const routes = [
  {
    path: '/',
    exact: true,
    auth: true,
    component: Companies,
    default: true,
  },
  {
    path: '/login',
    exact: true,
    component: Login,
  },
];

export const defaultRoute = () => routes.filter(r => r.default)[0];
export default routes;
