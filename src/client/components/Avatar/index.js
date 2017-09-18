import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip2 } from '@blueprintjs/labs';
import styled from 'styled-components';
import { compose, join, map, take, split } from 'ramda';

export const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.color};
  min-width: 36px;
  max-width: 36px;
  height: 36px;
  color: #FFF;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 1px 0 rgba(0,0,0,0.07);
`;

const initials = compose(join(''), map(take(1)), take(3), split(' '));

const Avatar = ({ name, color, showTooltip = false, className }) => (
  <Tooltip2 content={name} disabled={!showTooltip}>
    <Circle color={color} className={className}>
      { initials(name) }
    </Circle>
  </Tooltip2>
);

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  showTooltip: PropTypes.bool,
  className: PropTypes.string,
};

export default Avatar;
