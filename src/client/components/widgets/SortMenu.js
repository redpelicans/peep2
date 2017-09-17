import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SortMenu extends Component {
  state = {
    isVisible: false,
  };
  render() {
    const { sort } = this.props;
    console.log(sort);
    return (
      <span
        className="pt-icon-standard pt-icon-double-caret-vertical"
      />
    );
  }
}

SortMenu.propTypes = {
  sort: PropTypes.object,
};

export default SortMenu;
