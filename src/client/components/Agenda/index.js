import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import styled from 'styled-components';
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
  format,
} from 'date-fns';
import { Button, Menu, MenuItem } from '@blueprintjs/core';
import { getPathByName } from '../../routes';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Container, Title, Spacer } from '../widgets';
import { getSortedWorkers } from '../../selectors/people';
import { getEventsByWorkerDate } from '../../selectors/events';
import { changeDate } from '../../actions/agenda';
import { loadEvents } from '../../actions/events';
import { getCalendar } from '../../selectors/calendar';
import { getCurrentDate } from '../../selectors/agenda';
import { getUser } from '../../selectors/login';
import Calendar from './Calendar/Workers';
import Day from './Day';
import ExportTimesheet from './Timesheet';
import { ContextMenu } from '../widgets/ContextMenu';

const StyledContainer = styled(Container)`min-width: 1250px;`;

const Agenda = ({
  user,
  date,
  events,
  calendar,
  workers,
  goPreviousMonth,
  goNextMonth,
  goToday,
  addEvent,
  editEvent,
}) => {
  return (
    <StyledContainer>
      <Header>
        <HeaderLeft>
          <div className="pt-icon-standard pt-icon-calendar" />
          <Spacer />
          <Title title={format(date, 'MMMM YYYY')} />
        </HeaderLeft>
        <HeaderRight>
          <Button icon="arrow-left" onClick={goPreviousMonth} />
          <Spacer />
          <Button icon="stop" onClick={goToday} />
          <Spacer />
          <Button icon="arrow-right" onClick={goNextMonth} />
          <Spacer />
          <ContextMenu
            content={
              <Menu>
                <MenuItem
                  className="pt-icon-download"
                  onClick={() =>
                    ExportTimesheet(calendar, date, events, workers)}
                  text="Timesheet"
                />
              </Menu>
            }
          />
        </HeaderRight>
      </Header>
      <Calendar
        date={date}
        events={events}
        dayComponent={Day}
        calendar={calendar}
        onPeriodSelection={addEvent}
        editEvent={editEvent}
        workers={workers}
        user={user}
      />
    </StyledContainer>
  );
};

Agenda.propTypes = {
  date: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
  calendar: PropTypes.object,
  workers: PropTypes.array,
  goPreviousMonth: PropTypes.func.isRequired,
  goNextMonth: PropTypes.func.isRequired,
  goToday: PropTypes.func.isRequired,
  addEvent: PropTypes.func.isRequired,
  editEvent: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  calendar: getCalendar(state),
  date: getCurrentDate(state),
  workers: getSortedWorkers('firstName')(state),
  events: getEventsByWorkerDate(state),
  user: getUser(state),
});

const actions = { changeDate, loadEvents };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      const { date } = this.props;
      this.props.loadEvents({
        from: startOfMonth(date),
        to: endOfMonth(date),
      });
    },
    componentWillReceiveProps(nextProps) {
      const { date: nextDate } = nextProps;
      const { date } = this.props;
      if (date !== nextDate) {
        this.props.loadEvents({
          from: startOfMonth(nextDate),
          to: endOfMonth(nextDate),
        });
      }
    },
  }),
  withHandlers({
    goPreviousMonth: ({ date, changeDate }) => () =>
      changeDate(subMonths(date, 1)),
    goNextMonth: ({ date, changeDate }) => () => changeDate(addMonths(date, 1)),
    goToday: ({ changeDate }) => () => changeDate(new Date()),
    editEvent: ({ history }) => event =>
      history.push(getPathByName('editAgendaEvent', event.groupId)),
    addEvent: ({ history }) => (worker, from, to) =>
      history.push(getPathByName('addAgendaEvent'), {
        workerId: worker._id,
        from,
        to,
      }),
  }),
);

export default enhance(Agenda);
