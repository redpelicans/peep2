import createHistory from 'history/createBrowserHistory';

const history = createHistory();
export const push = (path, state) => history.push(path, state);
export const goBack = () => history.goBack();
export default history;
