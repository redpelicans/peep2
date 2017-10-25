import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { socketIoMiddleWare } from '../middlewares';

const configureStore = (initialState, io) =>
  createStore(
    rootReducer,
    initialState,
    applyMiddleware(socketIoMiddleWare(io), thunk),
  );

export default configureStore;
