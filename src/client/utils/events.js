import {
  slice,
  head,
  last,
  isEmpty,
  compose,
  reduce,
  map,
  prop,
  propEq,
  identity,
  filter,
  sortBy,
  pick,
} from 'ramda';
import {
  addHours,
  isSameDay,
  eachDay,
  startOfDay,
  endOfDay,
  getHours,
} from 'date-fns';
import { dmy, isWorkingDay } from '../utils';

export const EVENT_DAY = 'DAY';
export const EVENT_AM = 'AM';
export const EVENT_PM = 'PM';

export const isVacation = propEq('type', 'vacation');
export const isAfternoon = propEq('period', EVENT_PM);
export const isMorningEvent = propEq('period', EVENT_AM);
export const isAfternoonEvent = propEq('period', EVENT_PM);
export const isFullDayEvent = propEq('period', EVENT_DAY);
export const isHalfDayEvent = (period, event) =>
  period === EVENT_PM ? isAfternoonEvent(event) : isMorningEvent(event);
const isMidDay = date => getHours(date) === 12 || getHours(date) === 11;

const FullDayEvent = date => ({
  from: startOfDay(date),
  to: endOfDay(date),
  period: EVENT_DAY,
  value: 1,
});
const AMDayEvent = date => ({
  from: startOfDay(date),
  to: addHours(startOfDay(date), 12),
  period: EVENT_AM,
  value: 0.5,
});
const PMDayEvent = date => ({
  from: addHours(startOfDay(date), 12),
  to: endOfDay(date),
  period: EVENT_PM,
  value: 0.5,
});

const periodSlot = reduce((acc, e) => ({ ...acc, [e.period]: 1 }), {});
const isDayFree = event => !event;
const isDayFull = events => periodSlot(events)[EVENT_DAY];
const isMorningFree = events => !periodSlot(events)[EVENT_AM];
const isAfternoonFree = events => !periodSlot(events)[EVENT_PM];

const availableSlot = (events, calendar, event) => {
  const date = event.from;
  const dayEvents = events[dmy(date)];
  if (!isWorkingDay(calendar, date)) return;
  if (isDayFree(dayEvents)) return event;
  if (isDayFull(dayEvents)) return;
  if (isMorningEvent(event) && isMorningFree(dayEvents)) return event;
  if (isFullDayEvent(event) && isMorningFree(dayEvents))
    return AMDayEvent(date);
  if (isAfternoonEvent(event) && isAfternoonFree(dayEvents)) return event;
  if (isFullDayEvent(event) && isAfternoonFree(dayEvents))
    return PMDayEvent(date);
};

export const freeEventsFromPeriod = ({
  from,
  to,
  events = {},
  calendar = {},
}) => {
  const requestedEvents = [];
  if (isSameDay(from, to)) {
    if (isMidDay(from)) requestedEvents.push(PMDayEvent(from));
    else if (isMidDay(to)) requestedEvents.push(AMDayEvent(to));
    else requestedEvents.push(FullDayEvent(from));
  } else {
    const days = eachDay(from, to);
    days.forEach(d => {
      if (isSameDay(from, d) && isMidDay(from))
        requestedEvents.push(PMDayEvent(from));
      else if (isSameDay(to, d) && isMidDay(to))
        requestedEvents.push(AMDayEvent(to));
      else requestedEvents.push(FullDayEvent(d));
    });
  }
  const availableEvents = compose(
    filter(identity),
    map(e => availableSlot(events, calendar, e)),
  )(requestedEvents);
  console.log(from, to);
  return availableEvents;
};
