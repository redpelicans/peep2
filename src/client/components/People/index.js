import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const People = ({ people, companies }) => (
  <div className="pt-card pt-elevation-0 pt-interactive">
    {console.log(companies)}
    {console.log(people)}
  </div>
);


People.propTypes = {
  people: PropTypes.array.isRequired,
  companies: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  people: state.people,
  companies: state.companies,
});

const actions = { };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(People);
