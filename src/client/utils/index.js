import { getDay, format, eachDay, startOfMonth, endOfMonth } from 'date-fns';
import { filter } from 'ramda';

export const COMPANY = 'company';
export const PERSON = 'person';

export const dmy = date => date && format(date, 'DDMMYY');
export const isSunday = date => getDay(date) === 0;
export const isSaturday = date => getDay(date) === 6;
export const getCalendarDay = (calendar, date) => {
  const calDay = calendar && calendar[dmy(date)];
  if (calDay) return { date, isSpareDay: true, label: calDay.label };
  if (isSunday(date) || isSaturday(date)) return { date, isWeekendDay: true };
  return { date };
};
export const isWorkingDay = (calendar, date) => {
  const calDay = calendar && calendar[dmy(date)];
  return !isSunday(date) && !isSaturday(date) && !calDay;
};

export const getWorkingDaysInMonth = (calendar, date) => {
  const monthDays = eachDay(startOfMonth(date), endOfMonth(date));
  return filter(d => isWorkingDay(calendar, d), monthDays);
};
