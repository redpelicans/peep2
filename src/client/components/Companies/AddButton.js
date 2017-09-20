import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";

const FixedAddButtonElt = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: #394b59;
`;

const LinkElt = styled(Link)`color: white;`;

const AddButton = ({ to }) => (
  <LinkElt to={to}>
    <FixedAddButtonElt>
      <span className="pt-icon-large pt-icon-plus" />
    </FixedAddButtonElt>
  </LinkElt>
);

AddButton.propTypes = {
  to: PropTypes.string.isRequired
};

export default AddButton;
