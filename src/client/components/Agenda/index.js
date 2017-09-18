import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Calendar from './Calendar';
import Day from './Day';

const today = new Date();

const Agenda = ({ calendar }) => (
  <div>
    <Calendar
      date={today}
      dayComponent={Day}
      calendar={calendar}
      onPeriodSelection={console.log}
    />
  </div>
);


Agenda.propTypes = {
  calendar: PropTypes.object,
};

const mapStateToProps = state => ({
  calendar: state.calendar,
});


export default connect(mapStateToProps)(Agenda);
