import { ADD_ALERT } from '../actions/message';
import { COMPANY_ADDED, COMPANY_UPDATED } from '../actions/companies';
import { PEOPLE_ADDED, PEOPLE_UPDATED } from '../actions/people';

let id = 0;

const message = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_ALERT:
      return {
        id: (id += 1),
        ...payload,
      };
    case COMPANY_ADDED: {
      const { name, authorId } = payload;
      return {
        id: (id += 1),
        type: 'success',
        icon: 'home',
        message: `Company '${name}' added`,
        authorId,
      };
    }
    case COMPANY_UPDATED: {
      const { name, authorId } = payload;
      return {
        id: (id += 1),
        type: 'warning',
        icon: 'home',
        message: `Company '${name}' updated`,
        authorId,
      };
    }
    case PEOPLE_ADDED: {
      const { name, authorId } = payload;
      return {
        id: (id += 1),
        type: 'success',
        icon: 'team',
        message: `People '${name}' added`,
        authorId,
      };
    }
    case PEOPLE_UPDATED: {
      const { name, authorId } = payload;
      return {
        id: (id += 1),
        type: 'warning',
        icon: 'team',
        message: `People '${name}' updated`,
        authorId,
      };
    }
    default:
      return state;
  }
};

export default message;
