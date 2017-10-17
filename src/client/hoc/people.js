import { connect } from 'react-redux';
import { getPeople } from '../selectors/people';
import { values } from 'ramda';

const mapStateToProps = (state, props) => ({
  ...props,
  people: values(getPeople(state)),
});
const withPeople = Component => connect(mapStateToProps)(Component);

export default withPeople;
