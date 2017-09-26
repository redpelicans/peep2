import {
  compose,
  flatten,
  reduce,
  map,
  prop,
  propEq,
  identity,
  filter,
} from 'ramda';
import { eachDay, startOfDay, endOfDay } from 'date-fns';
import { dmy, isWorkingDay } from '../utils';

const EVENT_UNIT = 'day';
const EVENT_AM = 'AM';
const EVENT_PM = 'AM';

export const isVacation = propEq('type', 'vacation');
const isAfternoon = propEq('period', EVENT_PM);
const isMorningEvent = propEq('period', EVENT_AM);
const isAfternoonEvent = propEq('period', EVENT_PM);

const FullDayEvent = date => ({
  from: startOfDay(date),
  to: endOfDay(date),
  unit: EVENT_UNIT,
  value: 1,
});
const AMDayEvent = date => ({
  from: startOfDay(date),
  to: endOfDay(date),
  unit: EVENT_UNIT,
  value: 0.5,
  period: EVENT_AM,
});
const PMDayEvent = date => ({
  from: startOfDay(date),
  to: endOfDay(date),
  unit: EVENT_UNIT,
  value: 0.5,
  period: EVENT_PM,
});

const halfDays = reduce((acc, e) => ({ ...acc, [e.period]: 1 }), {});
const isDayFree = event => !event;
const isMorningFree = events => !halfDays(events)[EVENT_AM];
const isAfternoonFree = events => !halfDays(events)[EVENT_PM];
const availableEvent = (events, calendar, date) => {
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
    map(d => availableEvent(events, calendar, d)),
  )(days);
  return newEvents;
};
