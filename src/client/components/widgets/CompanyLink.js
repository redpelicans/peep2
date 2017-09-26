import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Colors } from '@blueprintjs/core';

export const CompanyLink = styled(Link)`
  text-overflow: ellipsis;
  overflow: hidden;
  text-transform: capitalize;
  font-size: 0.8rem;
  color: ${Colors.LIGHT_GRAY5} !important;
  text-decoration: none !important;
`;

export default CompanyLink;
