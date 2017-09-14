import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Kontrolo extends React.Component {
  constructor(props) {
    super(props);
    const { state, user, isAuthorized, redirect, history } = this.props;
    this.user = user(state);
    this.redirectTo = redirect;
    this.history = history;
    this.isAuthorized = () => isAuthorized(this.user);
    this.redirect = () => {
      if (this.redirectTo) history.push(this.redirectTo);
    };
  }

  getChildContext() {
    return {
      isAuthorized: this.isAuthorized,
      redirect: this.redirect,
    };
  }

  componentWillReceiveProps({ state, user }) {
    this.user = user(state);
  }

  render() {
    const { children } = this.props;
    return React.Children.only(children);
  }
}

Kontrolo.childContextTypes = {
  isAuthorized: PropTypes.func.isRequired,
  redirect: PropTypes.func,
};

Kontrolo.propTypes = {
  children: PropTypes.element.isRequired,
  state: PropTypes.object.isRequired,
  user: PropTypes.func,
  isAuthorized: PropTypes.func,
  redirect: PropTypes.string,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({ state });

export default withRouter(connect(mapStateToProps)(Kontrolo));


export class Auth extends React.Component { // eslint-disable-line react/no-multi-comp
  componentWillMount() {
    const { redirect } = this.props;
    const { isAuthorized, redirect: gotoAuth } = this.context;
    if (!isAuthorized()) {
      if (redirect) return gotoAuth();
    }
  }
  componentWillUpdate() {
    const { redirect } = this.props;
    const { isAuthorized, redirect: gotoAuth } = this.context;
    if (!isAuthorized()) {
      if (redirect) return gotoAuth();
    }
  }

  render() {
    const { children } = this.props;
    const { isAuthorized } = this.context;
    if (!isAuthorized()) return null;
    return React.Children.only(children);
  }
}

Auth.contextTypes = {
  isAuthorized: PropTypes.func.isRequired,
  redirect: PropTypes.func,
};

Auth.propTypes = {
  children: PropTypes.element.isRequired,
  redirect: PropTypes.bool,
};

