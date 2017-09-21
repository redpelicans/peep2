import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip2 } from '@blueprintjs/labs';
import styled from 'styled-components';
import { compose, join, map, take, split } from 'ramda';

const size2Dim = size => ({ LARGE: '52px', MEDIUM: '36px', SMALL: '24px' }[size] || '36px');
const size2Font = size => ({ LARGE: '1.2rem', MEDIUM: '1rem', SMALL: '0.7rem' }[size] || '1rem');
export const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.color};
  min-width: ${({ size }) => size2Dim(size)};
  max-width: ${({ size }) => size2Dim(size)};
  height: ${({ size }) => size2Dim(size)};
  color: #fff;
  text-transform: uppercase;
  font-size: ${({ size }) => size2Font(size)};
  font-weight: bold;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.07);
`;

const initials = compose(join(''), map(take(1)), take(3), split(' '));

export const LARGE = 'LARGE';
export const MEDIUM = 'MEDIUM';
export const SMALL = 'SMALL';

const Avatar = ({ name, color, size = MEDIUM, showTooltip = false, className }) => (
  <Tooltip2 content={name} disabled={!showTooltip}>
    <Circle color={color} size={size} className={className}>
      {initials(name)}
    </Circle>
  </Tooltip2>
);

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.string,
  showTooltip: PropTypes.bool,
  className: PropTypes.string,
};

export default Avatar;
