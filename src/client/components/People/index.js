import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const People = () => (
  <div>
      Hello People!
  </div>
);


People.propTypes = {
};

const mapStateToProps = state => ({
});

const actions = { };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(People);
