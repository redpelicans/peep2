import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withHandlers } from 'recompose';
import styled from 'styled-components';
import { Tabs2, Tab2 } from '@blueprintjs/core';
import { getRoute } from '../../routes';
import UserButton from './User';
import { NavBar, NavBarLeft, NavBarRight } from './NavBar';

const Logo = styled.i`
  color: #cd4436;
  margin-right: 10px;
  margin-left: 10px;
  font-size: 1.2em;
`;

const headerBtnClass = (icon, user) => classNames(`pt-button pt-minimal pt-icon-${icon}`, { 'pt-disabled': !user });
const Header = ({ handleTabChange, user, logout, className }) => {
  const divClass = classNames('pt-dark', className);
  const Companies = <span className={headerBtnClass('home', user)}>Companies</span>;
  const People = <span className={headerBtnClass('people', user)}>People</span>;
  const Agenda = <span className={headerBtnClass('calendar', user)}>Agenda</span>;
  return (
    <div className={divClass}>
      <NavBar>
        <NavBarLeft>
          <Logo className="fa fa-paper-plane" />
          <span>Peep by redpelicans</span>
        </NavBarLeft>
        <NavBarRight>
<<<<<<< HEAD
          <Tabs2 id="header "onChange={handleTabChange}>
=======
          <Tabs2 id="header" onChange={handleTabChange}>
>>>>>>> 0eceb5f3f52a0aad79850ece8b885e4d84e122f0
            <Tab2 id="agenda" title={Agenda} />
            <Tab2 id="companies" title={Companies} />
            <Tab2 id="people" title={People} />
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
};

export default withHandlers({
  handleTabChange: props => id => {
    const { path } = getRoute(id);
    const { history } = props;
    history.push(path);
  },
})(Header);
