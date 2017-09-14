import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getVisibleCompanies } from '../../selectors/companies';
import { togglePreferredFilter, togglePreferred, filterCompanyList, sortCompanyList } from '../../actions/companies';

const Companies = () => (
  <div>
    <p>Hello companies!</p>
  </div>
);


Companies.propTypes = {
  companies: PropTypes.array.isRequired,
  filter: PropTypes.string,
  preferredFilter: PropTypes.bool,
  sort: PropTypes.object,
};

const mapStateToProps = state => ({
  companies: getVisibleCompanies(state),
  filter: state.companies.filter,
  preferredFilter: state.companies.preferredFilter,
  sort: state.companies.sort,
  filterCompanyList: PropTypes.func.isRequired,
  sortCompanyList: PropTypes.func.isRequired,
  togglePreferred: PropTypes.func.isRequired,
  togglePreferredFilter: PropTypes.func.isRequired,

});

const actions = { filterCompanyList, sortCompanyList, togglePreferred, togglePreferredFilter };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Companies);
