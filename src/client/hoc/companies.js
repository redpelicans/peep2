import { connect } from 'react-redux';
import { getVisibleCompanies } from '../selectors/companies';

const mapStateToProps = (state, props) => ({
  ...props,
  companies: getVisibleCompanies(state),
});
const withCompanies = Component => connect(mapStateToProps)(Component);

export default withCompanies;
