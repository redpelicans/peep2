import React from 'react';
import styled from 'styled-components';
import { Container } from '../widgets';

const ContainerStyled = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  min-height: 300px;
`;

const NotFound = () => (
  <ContainerStyled>
    <h1>404</h1>
    <h1>Page not found</h1>
  </ContainerStyled>
);

export default NotFound;
