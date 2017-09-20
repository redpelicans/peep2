import { DATE_CHANGE } from "../actions/agenda";

const today = new Date();
const agenda = (state = { date: today }, action) => {
  const { type } = action;
  switch (type) {
    case DATE_CHANGE: {
      return { date: action.date };
    }
    default:
      return state;
  }
};

export default agenda;
