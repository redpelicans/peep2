import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FixedAddButtonElt = styled.div`
  position:fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width:50px;
  height:50px;
  bottom:25px;
  right:25px;
  background-color: #394b59;
`;

const LinkElt = styled(Link)`
  color:white;
`;

const AddButton = ({ to }) => (
  <LinkElt to={to}>
    <FixedAddButtonElt className="pt-card pt-elevation-0 pt-interactive">
      <span className="pt-icon-large pt-icon-plus" />
    </FixedAddButtonElt>
  </LinkElt>
);

AddButton.propTypes = {
  to: PropTypes.string.isRequired,
};

export default AddButton;
