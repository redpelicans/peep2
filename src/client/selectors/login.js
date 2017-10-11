import { createSelector } from 'reselect';

export const getLogin = state => state.login.user;
export const getUser = createSelector([getLogin], user => user);
