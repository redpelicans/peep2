import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const StyledNavBarLeft = styled.div`
  display: flex;
  font-size: 1.5em;
  align-items: center;
  flex: 1;
`;

export const StyledNavBarRight = styled.div`
  display: flex;
  font-size: 1.5em;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

export const StyledNavBar = styled.div`
  padding-top: 1rem;
  display: flex;
  margin-bottom: 1em;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const NavBarLeft = ({ children }) =>
  (<StyledNavBarLeft>
    {children}
  </StyledNavBarLeft>)
;

NavBarLeft.propTypes = {
  children: PropTypes.node,
};

export const NavBarRight = ({ children }) =>
  (<StyledNavBarRight>
    {children}
  </StyledNavBarRight>)
;

NavBarRight.propTypes = {
  children: PropTypes.node,
};

export const NavBar = ({ children }) => {
  const left = () => React.Children.toArray(children).find(child => child.type === NavBarLeft);
  const right = () => React.Children.toArray(children).find(child => child.type === NavBarRight);
  return (
    <div>
      <StyledNavBar>
        {left()}
        {right()}
      </StyledNavBar>
    </div>
  );
};

NavBar.propTypes = {
  children: PropTypes.node,
};
