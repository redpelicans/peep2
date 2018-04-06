import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { map } from 'ramda';
import {
  Menu,
  MenuItem,
  Popover,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import { onlyUpdateForKeys } from 'recompose';

const menuItemsIcon = {
  asc: 'pt-icon-caret-up',
  desc: 'pt-icon-caret-down',
};

const SortMenu = ({ sortTypes, handleClick, sort }) => (
  <Menu>
    {map(
      ({ key, label }) =>
        sort.by === key ? (
          <MenuItem
            key={key}
            text={label}
            onClick={() => handleClick(key)}
            icon={menuItemsIcon[sort.order]}
          />
        ) : (
          <MenuItem key={key} text={label} onClick={() => handleClick(key)} />
        ),
      sortTypes,
    )}
  </Menu>
);

SortMenu.propTypes = {
  handleClick: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  sortTypes: PropTypes.array.isRequired,
};

const StyledButton = styled.button`min-width: 80px;`;

const SortMenuWrapper = ({ sortTypes, onClick, sort }) => (
  <Popover
    placement="bottom"
    interactionKind={PopoverInteractionKind.CLICK}
    content={
      <SortMenu sortTypes={sortTypes} handleClick={onClick} sort={sort} />
    }
  >
    <StyledButton className="pt-button">
      Sort
      <span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
    </StyledButton>
  </Popover>
);

SortMenuWrapper.propTypes = {
  onClick: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  sortTypes: PropTypes.array.isRequired,
};

export default onlyUpdateForKeys(['sort'])(SortMenuWrapper);
