import { ALERT, DANGER, SUCCESS, EVTX_ERROR } from '../actions/message';
import { COMPANY_ADDED, COMPANY_UPDATED } from '../actions/companies';
import { PEOPLE_ADDED, PEOPLE_UPDATED } from '../actions/people';

const message = (state = { id: 0 }, action) => {
  const { type, payload } = action;
  switch (type) {
    case EVTX_ERROR:
      return {
        id: state.id + 1,
        type: DANGER,
        message: action.message,
      };
    case ALERT:
      return {
        id: state.id + 1,
        ...payload,
      };
    case COMPANY_ADDED: {
      const { name, authorId, _id } = payload;
      return {
        id: state.id + 1,
        type: SUCCESS,
        icon: 'pt-icon-home',
        message: `Company '${name}' added`,
        authorId,
        entityId: _id,
        actionType: type,
      };
    }
    case COMPANY_UPDATED: {
      const { name, authorId, _id } = payload;
      return {
        id: state.id + 1,
        type: SUCCESS,
        icon: 'pt-icon-home',
        message: `Company '${name}' updated`,
        authorId,
        entityId: _id,
        actionType: type,
      };
    }
    case PEOPLE_ADDED: {
      const { name, authorId, _id } = payload;
      return {
        id: state.id + 1,
        type: SUCCESS,
        icon: 'pt-icon-people',
        message: `People '${name}' added`,
        authorId,
        entityId: _id,
        actionType: type,
      };
    }
    case PEOPLE_UPDATED: {
      const { name, authorId, _id } = payload;
      return {
        id: state.id + 1,
        type: SUCCESS,
        icon: 'pt-icon-people',
        message: `People '${name}' updated`,
        authorId,
        entityId: _id,
        actionType: type,
      };
    }
    default:
      return state;
  }
};

export default message;
