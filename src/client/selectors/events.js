/* eslint-disable no-shadow */
import { compose, filter, values, reduce, propOr } from 'ramda';
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
const eventsByWorkerDate = (date, events) =>
  compose(
    reduce(hashByWorkerAndDate, {}),
    values,
    filter(
      ({ from, to }) =>
        belongsToPeriod(from, date) || belongsToPeriod(to, date),
    ),
  )(events);

export const getEvents = state => state.events.data;
export const getEventsByWorkerDate = createSelector(
  getCurrentDate,
  getEvents,
  eventsByWorkerDate,
);
