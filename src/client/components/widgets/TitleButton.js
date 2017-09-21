import React from 'react';
import styled from 'styled-components';
import { Button } from '@blueprintjs/core';

const StyledButton = styled(Button)`
  margin-right: 10px;
  margin-left: 10px;
`;

export const TitleButton = ({ ...props }) => <StyledButton {...props} />;

export default TitleButton;
