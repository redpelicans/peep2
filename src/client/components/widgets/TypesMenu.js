import React from 'react';
import { map } from 'ramda';
import { Popover2 } from '@blueprintjs/labs';
import { Menu, MenuItem, PopoverInteractionKind } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledType = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TypesMenu = ({ types, onClick, filter }) => {
  const handleClick = type => onClick(`~${type}`);
  return (
    <Menu>
      {map(
        type =>
          filter === `~${type.label}` ? (
            <MenuItem
              key={type.label}
              iconName="pt-icon-small-tick"
              disabled
              text={
                <StyledType>
                  <span>{type.label}</span>
                  <span>{type.count}</span>
                </StyledType>
              }
              onClick={() => handleClick(type.label)}
            />
          ) : (
            <MenuItem
              key={type.label}
              text={
                <StyledType>
                  <span>{type.label}</span>
                  <span>{type.count}</span>
                </StyledType>
              }
              onClick={() => handleClick(type.label)}
            />
          ),
        types,
      )}
    </Menu>
  );
};

TypesMenu.propTypes = {
  types: PropTypes.array,
  onClick: PropTypes.func.isRequired,
  filter: PropTypes.string,
};

const TypesMenuWrapper = ({ types, onClick, filter }) => (
  <Popover2
    placement="auto"
    interactionKind={PopoverInteractionKind.CLICK}
    content={<TypesMenu types={types} onClick={onClick} filter={filter} />}
  >
    <button className="pt-button">
      Types
      <span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
    </button>
  </Popover2>
);

TypesMenuWrapper.propTypes = {
  types: PropTypes.array,
  onClick: PropTypes.func.isRequired,
  filter: PropTypes.string,
};

export default TypesMenuWrapper;
