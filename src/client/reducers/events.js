import { compose, fromPairs, map, merge, omit } from 'ramda';
import { EVENTS_LOADED, EVENTS_ADDED, EVENTS_DELETED } from '../actions/events';

const make = event => ({
  ...event,
  from: new Date(event.from),
  to: new Date(event.to),
});
const makeAll = compose(fromPairs, map(event => [event._id, make(event)]));

const people = (state = { data: {} }, action) => {
  switch (action.type) {
    case EVENTS_DELETED:
      return { ...state, data: omit(action.payload, state.data) };
    case EVENTS_LOADED:
      return { ...state, data: makeAll(action.payload) };
    case EVENTS_ADDED:
      return { ...state, data: merge(state.data, makeAll(action.payload)) };
    default:
      return state;
  }
};

export default people;
