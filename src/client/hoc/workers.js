import { connect } from 'react-redux';
import { getSortedWorkers } from '../selectors/people';

const mapStateToProps = (state, props) => ({
  ...props,
  workers: getSortedWorkers('firstName')(state),
});
const withWorkers = Component => connect(mapStateToProps)(Component);

export default withWorkers;
