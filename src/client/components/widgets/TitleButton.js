import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';

const StyledButton = styled.button`
  margin-right: 10px;
  margin-left: 10px;
`;

export const TitleButton = ({ name, ...props }) => {
  const btnCls = classNames('pt-button pt-minimal', name);
  return (
    <StyledButton className={btnCls} {...props} />
  );
};

TitleButton.propTypes = {
  name: PropTypes.string.isRequired,
};

export default TitleButton;
