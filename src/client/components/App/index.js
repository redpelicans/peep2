import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styled from 'styled-components';
import routes, { defaultRoute } from '../../routes';
import UserButton from './User';
import { logout } from '../../actions/login';
import { Auth } from '../../lib/kontrolo';

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

const headerBtnClass = (icon, user) => classNames(`pt-button pt-minimal pt-icon-${icon}`, { 'pt-disabled': !user });

const Header = ({ user }) => (
  <nav className="pt-navbar pt-fixed-top pt-dark">
    <div style={{ margin: '0 auto', width: '80%' }}>
      <div className="pt-navbar-group pt-align-left">
        <div className="pt-navbar-heading">Peep</div>
      </div>
      <div className="pt-navbar-group pt-align-right">
        <button className={headerBtnClass('home', user)}>Companies</button>
        <button className={headerBtnClass('document', user)}>People</button>
        <span className="pt-navbar-divider" />
        <UserButton user={user} logout={logout} />
        <button className="pt-button pt-minimal pt-icon-notifications" />
        <button className="pt-button pt-minimal pt-icon-cog" />
      </div>
    </div>
  </nav>
);

Header.propTypes = {
  user: PropTypes.object,
};

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
  const makeAuthRoute = route => (prop) => {
    if (route.auth) {
      return (
        <Auth redirect>
          <route.component {...prop} />
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
