import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const Agenda = () => (
  <div>
      Hello Agenda!
  </div>
);


Agenda.propTypes = {
};

const actions = { };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapDispatchToProps)(Agenda);
