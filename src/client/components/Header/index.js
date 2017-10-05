import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const StyledHeaderLeftElement = styled.div`
  display: flex;
  font-size: 1.5em;
  justify-content: flex-start;
  align-items: center;
  margin-right: 25px;
  flex: 1;
`;

export const StyledHeaderRightElement = styled.div`
  display: flex;
  font-size: 1.5em;
  align-items: center;
  justify-content: flex-end;
  margin-left: 25px;
  flex: 1;
`;

export const StyledHeaderElement = styled.div`
  padding-top: 1rem;
  display: flex;
  margin-bottom: 1em;
  padding-bottom: 2em;
  padding-left: 1em;
  padding-right: 1em;
  justify-content: space-between;
  flex-wrap: wrap;
  border-bottom: 1.5px solid rgb(49, 65, 77);
  grid-row: 2;
`;

export const StyledTimeElement = styled.div`
  font-size: '.7rem';
  font-style: 'italic';
  display: 'block';
  float: 'right';
`;

export const HeaderLeft = ({ children }) => (
  <StyledHeaderLeftElement>{children}</StyledHeaderLeftElement>
);

HeaderLeft.propTypes = {
  children: PropTypes.node,
};

export const HeaderRight = ({ children }) => (
  <StyledHeaderRightElement>{children}</StyledHeaderRightElement>
);

HeaderRight.propTypes = {
  children: PropTypes.node,
};

export const Header = ({ obj, children }) => {
  const left = () =>
    React.Children.toArray(children).find(child => child.type === HeaderLeft);
  const right = () =>
    React.Children.toArray(children).find(child => child.type === HeaderRight);
  const timeLabels = o => {
    if (!o || !o.createdAt) return <span />;
    const res = [`Created ${o.createdAt.fromNow()}`];
    if (o.updatedAt) res.push(`Updated ${o.updatedAt.fromNow()}`);
    return <span>{res.join(' - ')}</span>;
  };

  const time = () => {
    if (!obj) return '';
    return <StyledTimeElement>{timeLabels(obj)}</StyledTimeElement>;
  };
  return (
    <div>
      <StyledHeaderElement>
        {left()}
        {right()}
      </StyledHeaderElement>
      {time()}
    </div>
  );
};

Header.propTypes = {
  obj: PropTypes.object,
  children: PropTypes.node,
};
