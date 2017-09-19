import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withStateHandlers } from 'recompose';
import { subMonths, addMonths, format } from 'date-fns';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import { Container, Title, TitleIcon, TitleButton } from '../widgets';
import { getSortedWorkers } from '../../selectors/people';
import Calendar from './WorkersCalendar';
import Day from './Day';

const Agenda = ({ date, calendar, workers, goPreviousMonth, goNextMonth, goToday }) => (
  <Container>
    <Header>
      <HeaderLeft>
        <TitleIcon name="pt-icon-standard pt-icon-calendar" />
        <Title title={format(date, 'MMMM YYYY')} />
      </HeaderLeft>
      <HeaderRight>
        <TitleButton name="pt-icon-standard pt-icon-arrow-left" onClick={goPreviousMonth} />
        <TitleButton name="pt-icon-standard pt-icon-stop" onClick={goToday} />
        <TitleButton name="pt-icon-standard pt-icon-arrow-right" onClick={goNextMonth} />
      </HeaderRight>
    </Header>
    <Calendar
      date={date}
      dayComponent={Day}
      calendar={calendar}
      onPeriodSelection={console.log}
      workers={workers}
    />
  </Container>
);


Agenda.propTypes = {
  date: PropTypes.object.isRequired,
  calendar: PropTypes.object,
  workers: PropTypes.array,
  goPreviousMonth: PropTypes.func.isRequired,
  goNextMonth: PropTypes.func.isRequired,
  goToday: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  calendar: state.calendar,
  workers: getSortedWorkers('firstName')(state),
});

const enhance = compose(
  withStateHandlers(
    { date: new Date() },
    {
      goPreviousMonth: ({ date }) => () => ({ date: subMonths(date, 1) }),
      goNextMonth: ({ date }) => () => ({ date: addMonths(date, 1) }),
      goToday: () => () => ({ date: new Date() }),
    },
  ),
  connect(mapStateToProps),
);

export default enhance(Agenda);
