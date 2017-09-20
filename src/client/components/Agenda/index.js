import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { compose, lifecycle, withHandlers } from "recompose";
import styled from "styled-components";
import { subMonths, addMonths, format } from "date-fns";
import { Header, HeaderLeft, HeaderRight } from "../Header";
import { Container, Title, TitleIcon, TitleButton } from "../widgets";
import { getSortedWorkers } from "../../selectors/people";
import { getEventsByWorkerDate } from "../../selectors/events";
import { changeDate } from "../../actions/agenda";
import { loadEvents } from "../../actions/events";
import { getCalendar } from "../../selectors/calendar";
import { getCurrentDate } from "../../selectors/agenda";
import { getUser } from "../../selectors/login";
import Calendar from "./WorkersCalendar";
import Day from "./Day";

const StyledContainer = styled(Container)`min-width: 1200px;`;

const Agenda = ({
  user,
  date,
  events,
  calendar,
  workers,
  goPreviousMonth,
  goNextMonth,
  goToday
}) => (
  <StyledContainer>
    <Header>
      <HeaderLeft>
        <TitleIcon name="pt-icon-standard pt-icon-calendar" />
        <Title title={format(date, "MMMM YYYY")} />
      </HeaderLeft>
      <HeaderRight>
        <TitleButton iconName="arrow-left" onClick={goPreviousMonth} />
        <TitleButton iconName="stop" onClick={goToday} />
        <TitleButton iconName="arrow-right" onClick={goNextMonth} />
      </HeaderRight>
    </Header>
    <Calendar
      date={date}
      events={events}
      dayComponent={Day}
      calendar={calendar}
      onPeriodSelection={console.log}
      workers={workers}
      user={user}
    />
  </StyledContainer>
);

Agenda.propTypes = {
  date: PropTypes.object.isRequired,
  calendar: PropTypes.object,
  workers: PropTypes.array,
  goPreviousMonth: PropTypes.func.isRequired,
  goNextMonth: PropTypes.func.isRequired,
  goToday: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  calendar: getCalendar(state),
  date: getCurrentDate(state),
  workers: getSortedWorkers("firstName")(state),
  events: getEventsByWorkerDate(state),
  user: getUser(state)
});

const actions = { changeDate, loadEvents };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.loadEvents();
    }
  }),
  withHandlers({
    goPreviousMonth: ({ date, changeDate }) => () =>
      changeDate(subMonths(date, 1)),
    goNextMonth: ({ date, changeDate }) => () => changeDate(addMonths(date, 1)),
    goToday: ({ changeDate }) => () => changeDate(new Date())
  })
);

export default enhance(Agenda);
