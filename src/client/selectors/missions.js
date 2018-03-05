import {
  sortBy,
  ifElse,
  is,
  identity,
  reverse,
  toLower,
  prop,
  values,
  match,
  split,
  compose,
  map,
  filter,
  allPass,
} from 'ramda';
import { createSelector } from 'reselect';

const doFilter = type => missions => {
  switch (type) {
    case 'current':
      return filter(mission => {
        return (
          new Date(mission.startDate) <= new Date() &&
          (!mission.endDate || new Date(mission.endDate) >= new Date())
        );
      }, missions);
    case 'past':
      return filter(mission => {
        return new Date(mission.endDate) <= new Date();
      }, missions);
    default:
      return missions;
  }
};

const sortByProp = mprop =>
  sortBy(compose(ifElse(is(String), toLower, identity), prop(mprop)));
const sortByOrder = order => (order === 'desc' ? reverse : identity);
const doSort = ({ by, order }) =>
  by && by.length ? compose(sortByOrder(order), sortByProp(by)) : identity;

export const regexp = spotlight => new RegExp(spotlight, 'i');
const getNamePredicate = spotlight => ({ name }) =>
  match(regexp(spotlight), name).length;
const getPredicate = spotlight => getNamePredicate(spotlight);
const getPredicates = spotlight =>
  compose(map(getPredicate), split(' '))(spotlight);
const doSpotlight = mspotlight =>
  filter(allPass([...getPredicates(mspotlight)]));

const filterAndSort = (type, spotlight, sort, missions) =>
  compose(doFilter(type), doSpotlight(spotlight), doSort(sort), values)(
    missions,
  );

export const getFilter = state => state.missions.filter;
export const getSpotlight = state => state.missions.spotlight;
export const getSort = state => state.missions.sort;
export const getMissions = state => state.missions.data;
export const getMission = (state, id) => state.missions.data[id];

export const getVisibleMissions = createSelector(
  [getFilter, getSpotlight, getSort, getMissions],
  (type, spotlight, sort, missions) =>
    filterAndSort(type, spotlight, sort, missions),
);

export const getClient = (id, companies) => companies[id];
export const getManager = (id, people) => people[id];
export const getWorkersFromMission = (people, workerIds) =>
  map(workerId => people[workerId], workerIds);
export const filterUndefinedWorkers = workers =>
  filter(worker => worker !== undefined, workers);
export const getWorkers = (people, workerIds) =>
  filterUndefinedWorkers(getWorkersFromMission(people, workerIds));
