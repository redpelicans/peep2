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
import { eachDay } from 'date-fns';
import { dmy } from '../utils';

const EVENT_UNIT = 'day';
const EVENT_AM = 'AM';
const EVENT_PM = 'AM';

export const isVacation = propEq('type', 'vacation');
const isAfternoon = propEq('period', EVENT_PM);
const isMorningEvent = propEq('period', EVENT_AM);
const isAfternoonEvent = propEq('period', EVENT_PM);

const flattenUnitDayEvents = event =>
  compose(
    flatten,
    map(unitEvent => ({ ...event, period: unitEvent.period })),
    prop('events'),
  )(event);
export const getUnitEvents = events =>
  reduce((acc, event) => [...acc, ...flattenUnitDayEvents(event)], [], events);

const FullDayEvent = date => ({ date, unit: EVENT_UNIT, value: 1 });
const AMDayEvent = date => ({
  date,
  unit: EVENT_UNIT,
  value: 0.5,
  period: EVENT_AM,
});
const PMDayEvent = date => ({
  date,
  unit: EVENT_UNIT,
  value: 0.5,
  period: EVENT_PM,
});

const isDayFree = event => !event;
const isMorningFree = event => event && isAfternoonEvent(event);
const isAfternoonFree = event => event && isMorningEvent(event);

const availableEvent = (events, date) => {
  const dayEvents = events[dmy(date)];
  if (isDayFree(dayEvents)) return FullDayEvent(date);
  const halfdays = reduce(
    (acc, e) => ({ ...acc, [e.period]: 1 }),
    {},
    dayEvents,
  );
  console.log(halfdays);
  if (isMorningFree(dayEvents)) return AMDayEvent(date);
  if (isAfternoonFree(dayEvents)) return PMDayEvent(date);
};

export const WorkerEventGroup = ({ from, to, events = {}, calendar = {} }) => {
  const days = eachDay(from, to);
  const unitEvents = compose(
    filter(identity),
    map(d => availableEvent(events, d)),
  )(days);
  return { from, to, events: unitEvents };
};
