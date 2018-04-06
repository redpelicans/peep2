import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { map } from 'ramda';
import {
  Button,
  ButtonGroup,
  Popover,
  Position,
  MenuItem,
} from '@blueprintjs/core';

export const ContextTag = ({ tagItems, setTag }) => {
  return (
    <Fragment>
      <MenuItem className="pt-icon-tag" text="Tag">
        {map(({ label, identifier, items }) => {
          return (
            <MenuItem key={label} text={label}>
              {map(
                ({ label, count }) => (
                  <MenuItem
                    key={label}
                    shouldDismissPopover={false}
                    text={`(${count}) ${label}`}
                    onClick={() => setTag(`${identifier}${label}`)}
                  />
                ),
                items,
              )}
            </MenuItem>
          );
        }, tagItems)}
      </MenuItem>
    </Fragment>
  );
};

ContextTag.propTypes = {
  tagItems: PropTypes.array,
  setTag: PropTypes.func,
};

export const ContextFilter = ({ currentFilter, filterItems, setFilter }) => {
  return (
    <Fragment>
      <MenuItem className="pt-icon-filter-list" text="Filter" />
      <ButtonGroup className="pt-minimal">
        {map(
          ({ label, text }) => (
            <Button
              key={label}
              active={currentFilter === label}
              onClick={() => setFilter(label)}
              text={text}
            />
          ),
          filterItems,
        )}
      </ButtonGroup>
    </Fragment>
  );
};

ContextFilter.propTypes = {
  currentFilter: PropTypes.string,
  filterItems: PropTypes.array,
  setFilter: PropTypes.func,
};

export const ContextSort = ({ currentSort, sortItems, setSort }) => {
  return (
    <Fragment>
      <MenuItem icon="pt-icon-double-caret-vertical" text="Sort" />
      <ButtonGroup className="pt-minimal">
        {map(
          ({ label, text }) => (
            <Button
              key={label}
              icon={
                currentSort.by === label
                  ? currentSort.order === 'asc'
                    ? 'pt-icon-caret-up'
                    : 'pt-icon-caret-down'
                  : null
              }
              active={currentSort === label}
              onClick={() => setSort(label)}
              text={text}
            />
          ),
          sortItems,
        )}
      </ButtonGroup>
    </Fragment>
  );
};

ContextSort.propTypes = {
  currentSort: PropTypes.object,
  sortItems: PropTypes.array,
  setSort: PropTypes.func,
};

export const ContextMenu = ({ content }) => {
  return (
    <Popover position={Position.BOTTOM_RIGHT} content={content}>
      <Button className="pt-minimal" icon="menu" />
    </Popover>
  );
};

ContextMenu.propTypes = {
  content: PropTypes.object,
};
