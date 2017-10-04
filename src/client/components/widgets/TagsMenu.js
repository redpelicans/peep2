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

const TagsMenu = ({ tags, onClick, filter }) => {
  const handleClick = tag => onClick(`#${tag}`);
  return (
    <Menu>
      {map(
        tag =>
          filter === `#${tag.label}` ? (
            <MenuItem
              key={tag.label}
              iconName="pt-icon-small-tick"
              disabled
              text={
                <StyledTag>
                  <span>{tag.label}</span>
                  <span>{tag.count}</span>
                </StyledTag>
              }
              onClick={() => handleClick(tag.label)}
            />
          ) : (
            <MenuItem
              key={tag.label}
              text={
                <StyledTag>
                  <span>{tag.label}</span>
                  <span>{tag.count}</span>
                </StyledTag>
              }
              onClick={() => handleClick(tag.label)}
            />
          ),
        tags,
      )}
    </Menu>
  );
};

TagsMenu.propTypes = {
  tags: PropTypes.array,
  onClick: PropTypes.func.isRequired,
  filter: PropTypes.string,
};

const TagsMenuWrapper = ({ tags, onClick, filter }) => (
  <Popover2
    placement="auto"
    interactionKind={PopoverInteractionKind.CLICK}
    content={<TagsMenu tags={tags} onClick={onClick} filter={filter} />}
  >
    <button className="pt-button">
      Tags
      <span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
    </button>
  </Popover2>
);

TagsMenuWrapper.propTypes = {
  tags: PropTypes.array,
  onClick: PropTypes.func.isRequired,
  filter: PropTypes.string,
};

export default TagsMenuWrapper;
