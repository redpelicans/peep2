import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Colors } from '@blueprintjs/core';

export const NameLink = styled(Link)`
  text-overflow: ellipsis;
  overflow: hidden;
  text-transform: capitalize;
  font-size: 0.9rem;
  font-weight: bold;
  color: ${Colors.LIGHT_GRAY5} !important;
  text-decoration: none !important;
`;

export default NameLink;
