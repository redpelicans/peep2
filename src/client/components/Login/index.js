import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import GoogleLogin from 'react-google-login';
import { loginRequest } from '../../actions/login';
import { defaultRoute } from '../../routes';

export const Content = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10%;
`;

class App extends React.Component {
  componentWillMount() {
    const { user, history } = this.props;
    if (user) history.replace(defaultRoute.path);
  }

  render() {
    const { user, loginRequest } = this.props; // eslint-disable-line no-shadow
    const responseGoogle = res => {
      if (!res.error) {
        console.log(`Signed in as ${res.getBasicProfile().getEmail()}`); // eslint-disable-line no-console
        loginRequest({
          email: res.getBasicProfile().getEmail(),
          idToken: res.getAuthResponse().id_token,
        });
      }
    };
    if (user) return <div />;
    return (
      <Content>
        <GoogleLogin
          clientId="223226395678-737dmg2e71b52hqr90nk7c9vtg7b40o5.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
      </Content>
    );
  }
}

App.propTypes = {
  loginRequest: PropTypes.func.isRequired,
  user: PropTypes.object,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({ user: state.login.user });
const actions = { loginRequest };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
