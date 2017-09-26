import styled from 'styled-components';
import { Colors } from '@blueprintjs/core';

export const Tag = styled.div`
  cursor: pointer;
  margin: 3px;
  background-color: ${Colors.DARK_GRAY5};
  border-radius: 3px;
  font-size: 0.8em;
  padding: 4px;
  padding-left: 8px;
  padding-right: 8px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.07);
`;

export default Tag;
