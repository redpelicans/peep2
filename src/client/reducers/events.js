import { compose, fromPairs, map } from "ramda";
import { EVENTS_LOADED } from "../actions/events";

const makeAll = compose(fromPairs, map(o => [o._id, o]));

const people = (state = { data: {} }, action) => {
  switch (action.type) {
    case EVENTS_LOADED:
      return { ...state, data: makeAll(action.payload) };
    default:
      return state;
  }
};

export default people;
