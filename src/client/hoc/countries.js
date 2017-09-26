import { connect } from 'react-redux';
import getCountries from '../selectors/countries';

const mapStateToProps = (state, props) => ({
  ...props,
  countries: getCountries(state),
});
export const withCountries = Component => connect(mapStateToProps)(Component);

export default withCountries;
