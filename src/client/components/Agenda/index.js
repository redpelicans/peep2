import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Calendar from './Calendar';
import Day from './Day';


const Agenda = () => (
  <div>
    <Calendar
      dayComponent={Day}
      onPeriodSelection={console.log}
    />
  </div>
);


Agenda.propTypes = {
};

const actions = { };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapDispatchToProps)(Agenda);
