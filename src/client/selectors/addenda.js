import { createSelector } from 'reselect';
import { allPass, filter, propEq, values } from 'ramda';

const getAddenda = state => values(state.addenda.data);
export const getFilter = state => state.addenda.filter;

const doFilter = type => addendum => {
  switch (type) {
    case 'current':
      if (
        addendum.startDate <= new Date() &&
        (!addendum.endDate || addendum.endDate >= new Date())
      )
        return true;
      return false;
    case 'past':
      if (addendum.endDate <= new Date()) return true;
      return false;
    default:
      return true;
  }
};

export const getMissionAddenda = id =>
  createSelector(getAddenda, getFilter, (addenda, type) =>
    filter(allPass([doFilter(type), propEq('missionId', id)]), addenda),
  );

export const getWorker = (workerId, people) => people[workerId];
