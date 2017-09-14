import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const People = () => (
  <div>
    Hello People!
  </div>
);


People.propTypes = {
};

const actions = { };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapDispatchToProps)(People);
