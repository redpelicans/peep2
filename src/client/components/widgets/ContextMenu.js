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
      <MenuItem iconName="pt-icon-double-caret-vertical" text="Sort" />
      <ButtonGroup className="pt-minimal">
        {map(
          ({ label, text }) => (
            <Button
              key={label}
              iconName={
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
      <Button className="pt-minimal" iconName="pt-icon-menu" />
    </Popover>
  );
};

ContextMenu.propTypes = {
  content: PropTypes.object,
};
