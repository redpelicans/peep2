import { propEq } from 'ramda';

export const isClient = propEq('type', 'client');
