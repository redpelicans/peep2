import React, { Component } from "react";
import styled from "styled-components";

const SortIcon = styled.div`
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  color: rgb(45, 60, 70);
`;

class SortMenu extends Component {
  state = {
    isVisible: false
  };
  render() {
    return (
      <SortIcon className="pt-icon-standard pt-icon-double-caret-vertical" />
    );
  }
}

SortMenu.propTypes = {};

export default SortMenu;
