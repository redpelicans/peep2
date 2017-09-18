import React from 'react';
// import PropTypes from 'prop-types';
import { onlyUpdateForKeys } from 'recompose';
import Calendar from './Calendar';
import Day from './Day';

const today = new Date();

const Agenda = () => (
  <div>
    <Calendar
      date={today}
      dayComponent={Day}
      onPeriodSelection={console.log}
    />
  </div>
);


Agenda.propTypes = {
};

export default onlyUpdateForKeys(['toto'])(Agenda);
