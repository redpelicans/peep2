import { intersection, join, propEq, isEmpty, difference, curry } from 'ramda';

export const ADMIN_ROLE = 'admin';
export const ROLES = [ADMIN_ROLE];

export const isWorker = propEq('type', 'worker');
export const fullName = ({ firstName, lastName }) =>
  join(' ', [firstName, lastName]);

export const hasSomeRoles = curry(
  (roles, user) =>
    !roles || (user && !isEmpty(intersection(roles, user.roles))),
);
export const hasAllRoles = curry(
  (roles, user) => user && isEmpty(difference(roles || [], user.roles)),
);
export const isAdmin = hasSomeRoles([ADMIN_ROLE]);
export const isEqual = (person1, person2) => person1._id === person2._id;
