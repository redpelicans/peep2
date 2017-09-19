import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const HeaderLeftElt = styled.div`
  display: flex;
  font-size: 1.5em;
  justify-content: flex-start;
  align-items: center;
  margin-right:25px;
  flex: 1;
`;

export const HeaderRightElt = styled.div`
  display: flex;
  font-size: 1.5em;
  align-items: center;
  justify-content: flex-end;
  margin-left:25px;
  flex: 1;
`;

export const HeaderElt = styled.div`
  padding-top: 1rem;
  display: flex;
  margin-bottom: 1em;
  padding-bottom: 2em;
  justify-content: space-between;
  flex-wrap: wrap;
  border-bottom: 1.5px solid rgb(49,65,77);
  grid-row: 2;
`;

export const TimeElt = styled.div`
  font-size: '.7rem';
  font-style: 'italic';
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
