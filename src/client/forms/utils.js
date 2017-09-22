import { map, compose, reduce, toPairs } from 'ramda';
export const getOneField = fields => name => ({ name, ...fields[name] });
export const getAllFields = compose(reduce((acc, [name, field]) => [...acc, { ...field, name }], []), toPairs);
