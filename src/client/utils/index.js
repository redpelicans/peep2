import { getDay, format } from 'date-fns';

export const dmy = date => date && format(date, ['DDMMYY']);
export const isSunday = date => getDay(date) === 0;
export const isSaturday = date => getDay(date) === 6;
export const getCalendarDay = (calendar, date) => {
  const calDay = calendar && calendar[dmy(date)];
  if (calDay) return { date, isSpareDay: true, label: calDay.label };
  if (isSunday(date) || isSaturday(date)) return { date, isWeekendDay: true };
  return { date };
};
