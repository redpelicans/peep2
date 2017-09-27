import { connect } from 'react-redux';
import getCities from '../selectors/cities';

const mapStateToProps = (state, props) => ({
  ...props,
  cities: getCities(state),
});

const withCities = Component => connect(mapStateToProps)(Component);

export default withCities;
