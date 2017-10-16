import { COMPANY, PERSON } from '../utils';
import { ALERT, DANGER, EVTX_ERROR } from '../actions/message';
import {
  COMPANY_ADDED,
  COMPANY_DELETED,
  COMPANY_UPDATED,
} from '../actions/companies';
import {
  PEOPLE_ADDED,
  PEOPLE_DELETED,
  PEOPLE_UPDATED,
} from '../actions/people';

const message = (state = { id: 0 }, action) => {
  const { type, payload } = action;
  switch (type) {
    case EVTX_ERROR:
      return {
        id: state.id + 1,
        type: DANGER,
        message: action.message,
        actionType: type,
      };
    case ALERT: {
      const { message, description } = payload;
      return {
        id: state.id + 1,
        actionType: type,
        label: message,
        description,
      };
    }
    case COMPANY_ADDED: {
      const { authorId, _id } = payload;
      return {
        id: state.id + 1,
        authorId,
        entityId: _id,
        actionType: type,
        entityType: COMPANY,
      };
    }
    case COMPANY_UPDATED: {
      const { authorId, _id } = payload;
      return {
        id: state.id + 1,
        authorId,
        entityId: _id,
        actionType: type,
        entityType: COMPANY,
      };
    }
    case COMPANY_DELETED: {
      const { name, authorId, _id } = payload;
      return {
        id: state.id + 1,
        authorId,
        entityId: _id,
        actionType: type,
        name,
        entityType: COMPANY,
      };
    }
    case PEOPLE_ADDED: {
      const { authorId, _id } = payload;
      return {
        id: state.id + 1,
        authorId,
        entityId: _id,
        actionType: type,
        entityType: PERSON,
      };
    }
    case PEOPLE_UPDATED: {
      const { authorId, _id } = payload;
      return {
        id: state.id + 1,
        authorId,
        entityId: _id,
        actionType: type,
        entityType: PERSON,
      };
    }
    case PEOPLE_DELETED: {
      const { name, authorId, _id } = payload;
      return {
        id: state.id + 1,
        authorId,
        entityId: _id,
        actionType: type,
        name,
        entityType: PERSON,
      };
    }
    default:
      return state;
  }
};

export default message;
