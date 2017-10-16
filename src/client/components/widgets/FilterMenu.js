import React from 'react';
import { map } from 'ramda';
import { Popover2 } from '@blueprintjs/labs';
import { Menu, MenuItem, PopoverInteractionKind } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledTag = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ItemsMenu = ({ items, identifier, onClick, filter }) => {
  const handleClick = item => onClick(`${identifier}${item}`);
  return (
    <Menu>
      {map(
        item =>
          filter === `${identifier}${item.label}` ? (
            <MenuItem
              key={item.label}
              iconName="pt-icon-small-tick"
              disabled
              text={
                <StyledTag>
                  <span>{item.label}</span>
                  <span>{item.count}</span>
                </StyledTag>
              }
              onClick={() => handleClick(item.label)}
            />
          ) : (
            <MenuItem
              key={item.label}
              text={
                <StyledTag>
                  <span>{item.label}</span>
                  <span>{item.count}</span>
                </StyledTag>
              }
              onClick={() => handleClick(item.label)}
            />
          ),
        items,
      )}
    </Menu>
  );
};

ItemsMenu.propTypes = {
  items: PropTypes.array,
  identifier: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  filter: PropTypes.string,
};

const ItemsMenuWrapper = ({ identifier, title, items, onClick, filter }) => (
  <Popover2
    placement="auto"
    interactionKind={PopoverInteractionKind.CLICK}
    content={
      <ItemsMenu
        items={items}
        identifier={identifier}
        onClick={onClick}
        filter={filter}
      />
    }
  >
    <button className="pt-button">
      {title}
      <span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
    </button>
  </Popover2>
);

ItemsMenuWrapper.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  filter: PropTypes.string,
};

export default ItemsMenuWrapper;
