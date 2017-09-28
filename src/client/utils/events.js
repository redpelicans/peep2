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

const EVENT_UNIT = 'day';
export const EVENT_AM = 'AM';
export const EVENT_PM = 'PM';

export const isVacation = propEq('type', 'vacation');
export const isAfternoon = propEq('period', EVENT_PM);
export const isMorningEvent = propEq('period', EVENT_AM);
export const isAfternoonEvent = propEq('period', EVENT_PM);
export const isFullDayEvent = event => !event.period;
export const isHalfDayEvent = (period, event) =>
  period === EVENT_PM ? isAfternoonEvent(event) : isMorningEvent(event);
const isMidDay = date => getHours(date) === 12 || getHours(date) === 11;

const FullDayEvent = date => ({
  from: startOfDay(date),
  to: endOfDay(date),
  unit: EVENT_UNIT,
  value: 1,
});
const AMDayEvent = date => ({
  from: startOfDay(date),
  to: addHours(startOfDay(date), 12),
  unit: EVENT_UNIT,
  value: 0.5,
  period: EVENT_AM,
});
const PMDayEvent = date => ({
  from: addHours(startOfDay(date), 12),
  to: endOfDay(date),
  unit: EVENT_UNIT,
  value: 0.5,
  period: EVENT_PM,
});

const halfDays = reduce((acc, e) => ({ ...acc, [e.period]: 1 }), {});
const isDayFree = event => !event;
const isMorningFree = events => !halfDays(events)[EVENT_AM];
const isAfternoonFree = events => !halfDays(events)[EVENT_PM];
const availableSlot = (events, calendar, date) => {
  const dayEvents = events[dmy(date)];
  if (!isWorkingDay(calendar, date)) return;
  if (isDayFree(dayEvents)) return FullDayEvent(date);
  if (isMorningFree(dayEvents)) return AMDayEvent(date);
  if (isAfternoonFree(dayEvents)) return PMDayEvent(date);
};

export const freeEventsFromPeriod = ({
  from,
  to,
  events = {},
  calendar = {},
}) => {
  const days = eachDay(from, to);
  const newEvents = compose(
    filter(identity),
    map(d => availableSlot(events, calendar, d)),
  )(days);
  if (isEmpty(newEvents)) return [];
  if (isSameDay(from, to)) {
    if (isMidDay(from)) return [PMDayEvent(from)];
    if (isMidDay(to)) return [AMDayEvent(to)];
    return newEvents;
  }
  if (newEvents.length === 1) {
    if (isMidDay(from) && isSameDay(prop('from', head(newEvents)), from))
      return [PMDayEvent(from)];
    if (isMidDay(to) && isSameDay(prop('to', last(newEvents)), to))
      return [AMDayEvent(to)];
    return newEvents;
  }
  return [
    isMidDay(from) && isSameDay(prop('from', head(newEvents)), from)
      ? PMDayEvent(from)
      : head(newEvents),
    ...slice(1, -1, newEvents),
    isMidDay(to) && isSameDay(prop('to', last(newEvents)), to)
      ? AMDayEvent(to)
      : last(newEvents),
  ];
};
