import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, HeaderLeft } from '../Header';
import { Container, Title, TitleIcon } from '../widgets';
import { getWorkers } from '../../selectors/people';
import Calendar from './WorkersCalendar';
import Day from './Day';

const today = new Date();

const Agenda = ({ calendar, workers }) => (
  <Container>
    <Header>
      <HeaderLeft>
        <TitleIcon name="pt-icon-standard pt-icon-home" />
        <Title title="Agenda" />
      </HeaderLeft>
    </Header>
    <Calendar
      date={today}
      dayComponent={Day}
      calendar={calendar}
      onPeriodSelection={console.log}
      workers={workers}
    />
  </Container>
);


Agenda.propTypes = {
  calendar: PropTypes.object,
  workers: PropTypes.array,
};

const mapStateToProps = state => ({
  calendar: state.calendar,
  workers: getWorkers(state),
});


export default connect(mapStateToProps)(Agenda);
