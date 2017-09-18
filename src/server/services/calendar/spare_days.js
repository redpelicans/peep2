import { format } from 'date-fns';
import { map } from 'ramda';

const d = (...params) => new Date(...params);
export const dmy = date => date && format(date, ['DDMMYY']);

const daysOff = [
  [d(2017, 0, 1), 'Jour de l\'an'],
  [d(2017, 3, 17), 'Lundi de Pâques'],
  [d(2017, 8, 18), 'Jour de VTT'],
  [d(2017, 9, 1), 'La Toussaint'],
];

const exportedDays = map(([date, label]) => [dmy(date), label])(daysOff);
export default exportedDays;
