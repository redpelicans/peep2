import React from 'react';
import PropTypes from 'prop-types';
import { Popover2 } from '@blueprintjs/labs';
import { map } from 'ramda';
import { Menu, MenuItem, PopoverInteractionKind } from '@blueprintjs/core';
import { onlyUpdateForKeys } from 'recompose';

const menuItemsIcon = {
  asc: 'pt-icon-caret-up',
  desc: 'pt-icon-caret-down',
}

const SortMenu = ({ sortTypes, handleClick, sort }) => (
  <Menu>
    {
      map(({ key, label}) => (
        sort.by === key ? (
          <MenuItem
            key={key}
            text={label}
            onClick={() => handleClick(key)}
            iconName={menuItemsIcon[sort.order]}
          />
        ) : (
          <MenuItem
            key={key}
            text={label}
            onClick={() => handleClick(key)}
          />
        )
      ), sortTypes)
    }
  </Menu>
);

SortMenu.propTypes = {
  handleClick: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  sortTypes: PropTypes.array.isRequired,
}

const SortMenuWrapper = ({ sortTypes, onClick, sort }) => (
  <Popover2
    placement="bottom"
    interactionKind={PopoverInteractionKind.CLICK}
    content={<SortMenu sortTypes={sortTypes} handleClick={onClick} sort={sort} />}
  >
    <button className="pt-button">
      Sort
      <span className="pt-icon-standard pt-icon-caret-down pt-align-right"></span>
    </button>
  </Popover2>
);

SortMenuWrapper.propTypes = {
  onClick: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  sortTypes: PropTypes.array.isRequired,
}

export default onlyUpdateForKeys(['sort'])(SortMenuWrapper);