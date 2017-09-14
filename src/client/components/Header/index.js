import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const HeaderLeftElt = styled.div`
  display: flex;
  fontSize: 1.5em;
  alignItems: center;
  flex: 1;
`;

export const HeaderRightElt = styled.div`
  display: flex;
  fontSize: 1.5em;
  alignItems: center;
  justifyContent: flex-end;
  flex: 1;
`;

export const HeaderElt = styled.div`
  paddingTop: 1rem;
  display: flex;
  marginBottom: 1em;
  borderBottom: 1px solid darkgrey;
  justifyContent: space-between;
  flexWrap: wrap;
`;

export const TimeElt = styled.div`
  fontSize: '.7rem';
  fontStyle: 'italic';
  display: 'block';
  float: 'right';
`;

export const HeaderLeft = ({ children }) =>
  (<HeaderLeftElt>
    {children}
  </HeaderLeftElt>)
;

HeaderLeft.propTypes = {
  children: PropTypes.node,
};

export const HeaderRight = ({ children }) =>
  (<HeaderRightElt>
    {children}
  </HeaderRightElt>)
;

HeaderRight.propTypes = {
  children: PropTypes.node,
};

export const Header = ({ obj, children }) => {
  const left = () => React.Children.toArray(children).find(child => child.type === HeaderLeft);
  const right = () => React.Children.toArray(children).find(child => child.type === HeaderRight);
  const timeLabels = (o) => {
    if (!o || !o.createdAt) return <span />;
    const res = [`Created ${o.createdAt.fromNow()}`];
    if (o.updatedAt) res.push(`Updated ${o.updatedAt.fromNow()}`);
    return <span>{res.join(' - ')}</span>;
  };

  const time = () => {
    if (!obj) return '';
    return (
      <TimeElt>
        {timeLabels(obj)}
      </TimeElt>
    );
  };
  return (
    <div>
      <HeaderElt>
        {left()}
        {right()}
      </HeaderElt>
      {time()}
    </div>
  );
};

Header.propTypes = {
  obj: PropTypes.object,
  children: PropTypes.node,
};
