import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Colors } from '@blueprintjs/core';

const FieldStyled = styled.div`grid-area: ${props => props.name};`;

const StyledBlock = styled.div`
  text-align: left;
  background-color: ${Colors.DARK_GRAY3};
  border-radius: 3px;
  height: 30%;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.07);
`;

const StyledBlockContent = styled.div`
  padding-top: 5px;
  margin-left: 15px;
  color: ${Colors.LIGHT_GRAY5} !important;
`;

const ViewFieldString = ({ name, label, value }) => (
  <FieldStyled name={name}>
    <label>{label}</label>
    <StyledBlock>
      {value && <StyledBlockContent>{value}</StyledBlockContent>}
    </StyledBlock>
  </FieldStyled>
);

ViewFieldString.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
};

export default ViewFieldString;
