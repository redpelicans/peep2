import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const LinkElt = styled(Link)`
  color:white;
`;

const IconElt = styled.span`
  color:white;
`;

const AddButton = ({ to }) => (
  <LinkElt to={to}>
    <IconElt className="pt-icon-large pt-icon-plus" />
  </LinkElt>
);

AddButton.propTypes = {
  to: PropTypes.string.isRequired,
};

export default AddButton;
