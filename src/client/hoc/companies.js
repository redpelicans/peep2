import { connect } from 'react-redux';
import { getCompanies } from '../selectors/companies';
import { values } from 'ramda';

const mapStateToProps = (state, props) => ({
  ...props,
  companies: values(getCompanies(state)),
});
const withCompanies = Component => connect(mapStateToProps)(Component);

export default withCompanies;
