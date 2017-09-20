/* eslint-disable no-shadow */
import { compose, filter, values, reduce, propOr } from "ramda";
import { createSelector } from "reselect";
import { isWithinRange, startOfMonth, endOfMonth, eachDay } from "date-fns";
import { getCurrentDate } from "./agenda";
import { dmy } from "../utils";

const hashByWorkerAndDate = (acc, event) => {
  const { workerId, startDate, endDate } = event;
  const workerDates = reduce(
    (acc, date) => ({
      ...acc,
      [dmy(date)]: [...propOr([], dmy(date), acc), event]
    }),
    {}
  );
  const period =
    dmy(startDate) === dmy(endDate) ? [startDate] : eachDay(startDate, endDate);
  return { ...acc, [workerId]: { ...acc[workerId], ...workerDates(period) } };
};

const belongsToPeriod = (date, monthDate) =>
  isWithinRange(date, startOfMonth(monthDate), endOfMonth(monthDate));
const eventsByWorkerDate = (date, events) =>
  compose(
    reduce(hashByWorkerAndDate, {}),
    filter(
      ({ startDate, endDate }) =>
        belongsToPeriod(startDate, date) || belongsToPeriod(endDate, date)
    ),
    values
  )(events);

export const getEvents = state => state.events.data;
export const getEventsByWorkerDate = createSelector(
  getCurrentDate,
  getEvents,
  eventsByWorkerDate
);
