import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

export const Title = ({ title, children }) => (
  <StyledTitle>{title || children}</StyledTitle>
);

Title.propTypes = {
  title: PropTypes.string,
  children: PropTypes.string,
};

export default Title;
