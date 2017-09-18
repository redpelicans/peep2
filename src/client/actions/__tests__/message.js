import configureStore from 'redux-mock-store';
import should from 'should';
import { alert, ALERT, DANGER, PRIMARY, SUCCESS, WARNING } from '../message';

const { describe, it } = global;

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('action message test', () => {
  it('should dispatch success message', () => {
    const initialState = {};
    const store = mockStore(initialState);

    const type = SUCCESS;
    const message = 'test message';
    const description = 'test description';

    store.dispatch(alert({
      type,
      message,
      description,
    }));

    const actions = store.getActions();
    const expectedPayload = { type: ALERT, payload: { type, message, description } };
    should(actions).eql([expectedPayload]);
  });
  it('should dispatch warning message', () => {
    const initialState = {};
    const store = mockStore(initialState);

    const type = WARNING;
    const message = 'test message';
    const description = 'test description';

    store.dispatch(alert({
      type,
      message,
      description,
    }));

    const actions = store.getActions();
    const expectedPayload = { type: ALERT, payload: { type, message, description } };
    should(actions).eql([expectedPayload]);
  });
  it('should dispatch danger message', () => {
    const initialState = {};
    const store = mockStore(initialState);

    const type = DANGER;
    const message = 'test message';
    const description = 'test description';

    store.dispatch(alert({
      type,
      message,
      description,
    }));

    const actions = store.getActions();
    const expectedPayload = { type: ALERT, payload: { type, message, description } };
    should(actions).eql([expectedPayload]);
  });
  it('should dispatch informative message', () => {
    const initialState = {};
    const store = mockStore(initialState);

    const type = PRIMARY;
    const message = 'test message';
    const description = 'test description';

    store.dispatch(alert({
      type,
      message,
      description,
    }));

    const actions = store.getActions();
    const expectedPayload = { type: ALERT, payload: { type, message, description } };
    should(actions).eql([expectedPayload]);
  });
});
