import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

export function configureStore(reducer, initialState, hooks, middlewares = []) {
  const allMiddlewares = [...middlewares, testMiddleware(hooks), thunk];
  return createStore(reducer, initialState, applyMiddleware(...allMiddlewares));
}

const isFunction = arg => typeof arg === 'function';
const testMiddleware = (hooks = {}) => {
  return store => next => action => {
    try {
      const result = next(action);
      const cb = hooks[action.type];
      if (cb) {
        if (!isFunction(cb))
          throw new Error("action's type value must be a function");
        cb(store.getState, action);
      }
      return result;
    } catch (e) {
      console.log(e); //eslint-disable-line no-console
    }
  };
};
