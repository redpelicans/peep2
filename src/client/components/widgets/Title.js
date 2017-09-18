import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledTitle = styled.div`
`;

export const Title = ({ title }) => (
  <StyledTitle>
    {title}
  </StyledTitle>
);

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Title;
