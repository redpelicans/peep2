import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledFixedAddButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: #394b59;
`;

const StyledLink = styled(Link)`color: white;`;

const AddButton = ({ to }) => (
  <StyledLink to={to}>
    <StyledFixedAddButton>
      <span className="pt-icon-large pt-icon-plus" />
    </StyledFixedAddButton>
  </StyledLink>
);

AddButton.propTypes = {
  to: PropTypes.string.isRequired
};

export default AddButton;
