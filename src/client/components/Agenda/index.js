import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, HeaderLeft } from '../Header';
import { Container, Title, TitleIcon } from '../widgets';
import Calendar from './Calendar';
import Day from './Day';

const today = new Date();

const Agenda = ({ calendar }) => (
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
    />
  </Container>
);


Agenda.propTypes = {
  calendar: PropTypes.object,
};

const mapStateToProps = state => ({
  calendar: state.calendar,
});


export default connect(mapStateToProps)(Agenda);
