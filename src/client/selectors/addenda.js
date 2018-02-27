import { createSelector } from 'reselect';
import { filter, propEq, values } from 'ramda';

export const getAddenda = state => values(state.addenda.data);

export const getMissionAddenda = id =>
  createSelector(getAddenda, filter(propEq('missionId', id)));

export const getWorker = (workerId, people) => people[workerId];
