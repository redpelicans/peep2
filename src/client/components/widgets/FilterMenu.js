import React from 'react';
import { map } from 'ramda';
import { Popover2 } from '@blueprintjs/labs';
import { Menu, MenuItem, PopoverInteractionKind } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledItem = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  justify-content: space-between;
`;

const StyledMenu = styled(Menu)`max-width: 180px;`;

const StyledItemLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  width: 85%;
`;

const StyledButton = styled.button`min-width: 80px;`;

const StyledItemCount = styled.span`width: auto;`;

const ItemsMenu = ({ items, identifier, onClick, filter }) => {
  const handleClick = item => onClick(`${identifier}${item}`);
  return (
    <StyledMenu>
      {map(
        item =>
          filter === `${identifier}${item.label}` ? (
            <MenuItem
              key={item.label}
              iconName="pt-icon-small-tick"
              disabled
              text={
                <StyledItem>
                  <StyledItemLabel>{item.label}</StyledItemLabel>
                  <StyledItemCount>{item.count}</StyledItemCount>
                </StyledItem>
              }
              onClick={() => handleClick(item.label)}
            />
          ) : (
            <MenuItem
              key={item.label}
              text={
                <StyledItem>
                  <StyledItemLabel>{item.label}</StyledItemLabel>
                  <StyledItemCount>{item.count}</StyledItemCount>
                </StyledItem>
              }
              onClick={() => handleClick(item.label)}
            />
          ),
        items,
      )}
    </StyledMenu>
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
    <StyledButton className="pt-button">
      {title}
      <span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
    </StyledButton>
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
