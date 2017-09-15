import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import routes, { defaultRoute } from '../../routes';
import { logout } from '../../actions/login';
import { Auth } from '../../lib/kontrolo';
import Header from './Header';

const Layout = styled.div`
  display: grid;
  grid-template-areas: "header" "content";
  grid-template-columns: 100%;
  grid-template-rows: 61px 1fr;
  grid-auto-flow: column;
  height: 100vh;
`;

const Content = styled.div`
  grid-area: content;
  background-color: #293742;
  color: #f5f8fa;
`;


const StyledHeader = styled(Header)`
  grid-area: header;
  position: absolute;
  width: 100%;
  background-color: #394b59;
  box-shadow: inset 0 0 0 1px rgba(16, 22, 26, 0.2), 0 0 0 rgba(16, 22, 26, 0), 0 1px 1px rgba(16, 22, 26, 0.4);
  color: #f5f8fa;
  padding: 0 15px;
`;


const App = props => {
  const makeAuthRoute = route => (props) => { // eslint-disable-line no-shadow
    if (route.auth) {
      return (
        <Auth redirect>
          <route.component {...props} />
        </Auth>
      );
    }
    return (<route.component {...props} />);
  };
  return (
    <Layout>
      <StyledHeader {...props} />
      <Content>
        <Switch>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              render={makeAuthRoute(route)}
            />
          ))}
          <Auth redirect>
            <Route component={defaultRoute.component} />
          </Auth>
        </Switch>
      </Content>
    </Layout>
  );
};

App.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.login.user,
});

const actions = { logout };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
