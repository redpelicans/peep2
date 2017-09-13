import R from 'ramda';

/* trim and removes extra spaces */
export const cleanInputString = (value = '') =>
  R.compose(R.replace(/\s{2,}/g, ' '), R.trim)(value);
