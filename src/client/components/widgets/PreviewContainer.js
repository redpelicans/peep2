import styled, { css } from 'styled-components';
import { Colors } from '@blueprintjs/core';

const PreviewContainer = styled.div`
  cursor: default !important;
  width: 300px;
  display: flex;
  padding: 10px;
  padding-left: 15px;
  padding-right: 15px;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
  border: 1px solid rgba(49, 65, 77, 0.5);
  border-radius: 1px;
`;

export default PreviewContainer;
