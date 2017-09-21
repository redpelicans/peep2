import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledTitle = styled.span``;

export const Title = ({ title, children }) => <StyledTitle>{title || children}</StyledTitle>;

Title.propTypes = {
  title: PropTypes.string,
  children: PropTypes.string,
};

export default Title;
