import { values } from 'ramda';

export const getAddenda = state => values(state.addenda.data);

export const getWorker = (workerId, people) => people[workerId];
