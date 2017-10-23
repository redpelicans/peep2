import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withHandlers } from 'recompose';
import styled from 'styled-components';
import { Tabs2, Tab2 } from '@blueprintjs/core';
import { getRouteByName, getRouteByPath, defaultRoute } from '../../routes';
import UserButton from './User';
import { NavBar, NavBarLeft, NavBarRight } from './NavBar';
import { Spacer } from '../widgets';
import { getRouteRoles } from '../../routes';
import { isAdmin } from '../../utils/people';

const Logo = styled.i`
  color: #cd4436;
  margin-right: 10px;
  font-size: 1.2em;
`;

const headerBtnClass = (icon, user) =>
  classNames(`pt-button pt-minimal pt-icon-${icon}`, { 'pt-disabled': !user });
const Header = ({ handleTabChange, user, logout, className, history }) => {
  const Companies = (
    <span className={headerBtnClass('home', user)}>Companies</span>
  );
  const People = <span className={headerBtnClass('people', user)}>People</span>;
  const Agenda = (
    <span className={headerBtnClass('calendar', user)}>Agenda</span>
  );
  const Notes = <span className={headerBtnClass('document', user)}>Notes</span>;
  const Missions = (
    <span className={headerBtnClass('shopping-cart', user)}>Missions</span>
  );
  const getRouteName = path => {
    const start = path.indexOf('/');
    const end =
      path.indexOf('/', 1) !== -1 ? path.indexOf('/', 1) : path.length;
    const result = path.substring(start, end);
    switch (result) {
      case '/':
        return '/companies';
      case '/person':
        return '/people';
      case '/company':
        return '/companies';
      case '/note':
        return '/notes';
      case '/mission':
        return '/missions';
      default:
        return result;
    }
  };
  const selectedRoute =
    getRouteByPath(getRouteName(history.location.pathname)) || defaultRoute;
  const selectedTab = selectedRoute.name;
  return (
    <div className={className}>
      <NavBar>
        <NavBarLeft>
          <Logo className="fa fa-paper-plane" />
          <span>Peep by redpelicans</span>
        </NavBarLeft>
        <NavBarRight>
          <Tabs2
            id="header"
            onChange={handleTabChange}
            selectedTabId={selectedTab}
          >
            <Tab2 id="agenda" title={Agenda} />
            {isAdmin(user) && <Tab2 id="companies" title={Companies} />}
            {isAdmin(user) && <Tab2 id="people" title={People} />}
            <Tab2 id="notes" title={Notes} />
            <Tab2 id="missions" title={Missions} />
          </Tabs2>
          <span className="pt-navbar-divider" />
          <UserButton user={user} logout={logout} />
          <Spacer />
        </NavBarRight>
      </NavBar>
    </div>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
};

export default withHandlers({
  handleTabChange: props => id => {
    const { path } = getRouteByName(id);
    const { history } = props;
    history.push(path);
  },
})(Header);
