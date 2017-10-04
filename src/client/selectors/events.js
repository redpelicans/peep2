/* eslint-disable no-shadow */
import {
  curry,
  identity,
  compose,
  prop,
  filter,
  reject,
  values,
  reduce,
  propOr,
  isEmpty,
  head,
  last,
  pick,
  sortBy,
} from 'ramda';
import { createSelector } from 'reselect';
import { isWithinRange, startOfMonth, endOfMonth, eachDay } from 'date-fns';
import { getCurrentDate } from './agenda';
import { dmy } from '../utils';

const hashByWorkerAndDate = (acc, event) => {
  const { workerId, from, to } = event;
  const workerDates = (events, days) =>
    reduce(
      (acc, date) => ({
        ...acc,
        [dmy(date)]: [...propOr([], dmy(date), events), event],
      }),
      {},
      days,
    );
  const period = dmy(from) === dmy(to) ? [from] : eachDay(from, to);
  return {
    ...acc,
    [workerId]: { ...acc[workerId], ...workerDates(acc[workerId], period) },
  };
};

const belongsToPeriod = (date, monthDate) =>
  isWithinRange(date, startOfMonth(monthDate), endOfMonth(monthDate));
const eventsByWorkerDate = curry((date, events) =>
  compose(
    reduce(hashByWorkerAndDate, {}),
    values,
    filter(
      ({ from, to }) =>
        belongsToPeriod(from, date) || belongsToPeriod(to, date),
    ),
  )(events),
);

export const getEvents = state => state.events.data;
export const getEventsByWorkerDate = createSelector(
  getCurrentDate,
  getEvents,
  eventsByWorkerDate,
);

export const getWorkerEventsByDate = (workerId, groupId) =>
  createSelector(getCurrentDate, getEvents, (date, events) =>
    compose(
      prop(workerId),
      eventsByWorkerDate(date),
      !groupId ? identity : reject(e => e.groupId === groupId),
    )(events),
  );

const eventGroup = id => events => {
  const evts = compose(
    sortBy(prop('from')),
    filter(e => e.groupId === id),
    values,
  )(events);
  if (isEmpty(evts)) return;
  return {
    groupId: id,
    from: head(evts).from,
    to: last(evts).to,
    ...pick(['workerId', 'type', 'status'], head(evts)),
  };
};

export const getEventGroup = id => createSelector(getEvents, eventGroup(id));
