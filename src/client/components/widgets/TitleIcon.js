import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledIcon = styled.div`
  margin-right: 10px;
  margin-left: 10px;
`;

export const TitleIcon = ({ name }) => (
  <StyledIcon className={name} />
);

TitleIcon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default TitleIcon;
