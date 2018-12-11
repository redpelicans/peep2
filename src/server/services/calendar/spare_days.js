import { format } from 'date-fns';
import { map } from 'ramda';

const d = (...params) => new Date(...params);
export const dmy = date => date && format(date, ['DDMMYY']);

const daysOff = [
  [d(2017, 0, 1), "Jour de l'an"],
  [d(2017, 3, 17), 'Lundi de Pâques'],
  [d(2017, 10, 1), 'La Toussaint'],
  [d(2017, 10, 11), 'Armistice 1918'],
  [d(2017, 11, 25), 'Noẽl'],
  [d(2018, 0, 1), "Jour de l'an"],
  [d(2018, 3, 2), 'Lundi de Pâques'],
  [d(2018, 4, 1), 'Fête du Travail'],
  [d(2018, 4, 8), '8 mai 1945'],
  [d(2018, 4, 10), 'Ascension'],
  [d(2018, 4, 21), 'Pentecote'],
  [d(2018, 6, 14), 'Fête Nationale'],
  [d(2018, 7, 15), 'Assomption'],
  [d(2018, 10, 1), 'La Toussaint'],
  [d(2018, 10, 11), 'Armistice 1918'],
  [d(2018, 11, 25), 'Noẽl'],
  [d(2019, 0, 1), "Jour de l'an"],
  [d(2019, 3, 22), 'Lundi de Pâques'],
  [d(2019, 4, 1), 'Fête du Travail'],
  [d(2019, 4, 8), '8 mai 1945'],
  [d(2018, 4, 30), 'Ascension'],
  [d(2019, 5, 10), 'Pentecote'],
  [d(2019, 6, 14), 'Fête Nationale'],
  [d(2019, 7, 15), 'Assomption'],
  [d(2019, 10, 1), 'La Toussaint'],
  [d(2019, 10, 11), 'Armistice 1918'],
  [d(2019, 11, 25), 'Noẽl'],
];

const exportedDays = map(([date, label]) => [dmy(date), label])(daysOff);
export default exportedDays;
