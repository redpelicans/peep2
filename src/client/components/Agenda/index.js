import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const Agenda = () => {
  return (
    <div>
      Hello Agenda!
    </div>
  );
};


Agenda.propTypes = {
};

const mapStateToProps = state => ({
});

const actions = { };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Agenda);
