import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SortIcon = styled.div`
  cursor: pointer;
  color:rgb(45,60,70);
`;

class SortMenu extends Component {
  state = {
    isVisible: false,
  };
  render() {
    const { sort } = this.props;
    console.log(sort);
    return (
      <SortIcon
        className="pt-icon-standard pt-icon-double-caret-vertical"
      />
    );
  }
}

SortMenu.propTypes = {
  sort: PropTypes.object,
};

export default SortMenu;
