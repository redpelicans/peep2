import { fromPairs, map, compose } from 'ramda';
import { CALENDAR_LOADED } from '../actions/calendar';

const calendar = (state = { data: [] }, action) => {
  const { type, payload } = action;
  switch (type) {
    case CALENDAR_LOADED: {
      return compose(fromPairs, map(([mdy, label]) => [mdy, { label }]))(
        payload,
      );
    }
    default:
      return state;
  }
};

export default calendar;
