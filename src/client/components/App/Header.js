import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withHandlers } from 'recompose';
import styled from 'styled-components';
import { Tabs2, Tab2 } from '@blueprintjs/core';
import { getRouteByName, getRouteByPath, defaultRoute } from '../../routes';
import UserButton from './User';
import { NavBar, NavBarLeft, NavBarRight } from './NavBar';

const Logo = styled.i`
  color: #cd4436;
  margin-right: 10px;
  margin-left: 10px;
  font-size: 1.2em;
`;

const headerBtnClass = (icon, user) => classNames(`pt-button pt-minimal pt-icon-${icon}`, { 'pt-disabled': !user });
const Header = ({ handleTabChange, user, logout, className, history }) => {
  const Companies = <span className={headerBtnClass('home', user)}>Companies</span>;
  const People = <span className={headerBtnClass('people', user)}>People</span>;
  const Agenda = <span className={headerBtnClass('calendar', user)}>Agenda</span>;
  const Notes = <span className={headerBtnClass('document', user)}>Notes</span>;
  const selectedRoute = getRouteByPath(history.location.pathname) || defaultRoute;
  const selectedTab = selectedRoute.name;
  return (
    <div className={className}>
      <NavBar>
        <NavBarLeft>
          <Logo className="fa fa-paper-plane" />
          <span>Peep by redpelicans</span>
        </NavBarLeft>
        <NavBarRight>
          <Tabs2 id="header" onChange={handleTabChange} selectedTabId={selectedTab}>
            <Tab2 id="agenda" title={Agenda} />
            <Tab2 id="companies" title={Companies} />
            <Tab2 id="people" title={People} />
            <Tab2 id="notes" title={Notes} />
          </Tabs2>
          <span className="pt-navbar-divider" />
          <UserButton user={user} logout={logout} />
          <button className="pt-button pt-minimal pt-icon-notifications" />
          <button className="pt-button pt-minimal pt-icon-cog" />
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
