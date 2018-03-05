import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';
import {
  Button,
  ButtonGroup,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
  Position,
} from '@blueprintjs/core';
import { getPeople } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import {
  getSpotlight,
  getSort,
  getVisibleMissions,
} from '../../selectors/missions';
import {
  deleteMission,
  sortMissions,
  spotlightMissions,
} from '../../actions/missions';
import { Header, HeaderRight, HeaderLeft } from '../Header';
import {
  LinkButton,
  Container,
  Title,
  Spacer,
  Search,
  SortMenu,
} from '../widgets';
import { getPathByName } from '../../routes';
import List from './List';

const sortTypes = [
  { key: 'endDate', label: 'Sort by ended date' },
  { key: 'startDate', label: 'Sort by started date' },
  { key: 'name', label: 'Sort by name' },
];

export const Missions = ({
  people,
  companies,
  missions,
  spotlight,
  sort,
  deleteMission,
  spotlightMissions,
  onFilterChange,
  sortMissions,
}) => {
  return (
    <Container>
      <Header>
        <HeaderLeft>
          <div className="pt-icon-standard pt-icon-shopping-cart" />
          <Spacer />
          <Title title="Missions" />
        </HeaderLeft>
        <HeaderRight>
          <Search
            spotlight={spotlight}
            onChange={onFilterChange}
            resetValue={() => spotlightMissions('')}
          />
          <Spacer />
          <Popover position={Position.BOTTOM_RIGHT}>
            <Button className="pt-minimal" iconName="pt-icon-menu" />
            <Menu>
              <MenuDivider title="Mission" />
              <LinkButton
                className="pt-minimal"
                to={getPathByName('addMission')}
                iconName="pt-icon-add"
                text="Add"
              />
              <MenuItem className="pt-icon-filter-list" text="Filter" />
              <ButtonGroup className="pt-minimal">
                <Button text="All" /> // onClick={() => set_filter('all')} // active={filter === 'all'}
                <Button text="Current" /> // onClick={() => set_filter('current')} // active={filter === 'current'}
                <Button text="Past" /> // onClick={() => set_filter('past')} // active={filter === 'past'}
              </ButtonGroup>
              <MenuItem iconName="pt-icon-double-caret-vertical" text="Sort" />
              <ButtonGroup className="pt-minimal">
                <Button
                  iconName={
                    sort.by === 'name'
                      ? sort.order === 'asc'
                        ? 'pt-icon-caret-up'
                        : 'pt-icon-caret-down'
                      : null
                  }
                  text="name"
                  onClick={() => sortMissions('name')}
                />
                <Button
                  iconName={
                    sort.by === 'startDate'
                      ? sort.order === 'asc'
                        ? 'pt-icon-caret-up'
                        : 'pt-icon-caret-down'
                      : null
                  }
                  text="start date"
                  onClick={() => sortMissions('startDate')}
                />
                <Button
                  iconName={
                    sort.by === 'endDate'
                      ? sort.order === 'asc'
                        ? 'pt-icon-caret-up'
                        : 'pt-icon-caret-down'
                      : null
                  }
                  text="end date"
                  onClick={() => sortMissions('endDate')}
                />
              </ButtonGroup>
            </Menu>
          </Popover>
        </HeaderRight>
      </Header>
      <List
        people={people}
        companies={companies}
        missions={missions}
        deleteMission={deleteMission}
      />
    </Container>
  );
};

Missions.propTypes = {
  people: PropTypes.object,
  companies: PropTypes.object,
  missions: PropTypes.array,
  spotlight: PropTypes.string,
  sort: PropTypes.object,
  deleteMission: PropTypes.func.isRequired,
  spotlightMissions: PropTypes.func.isRequired,
  sortMissions: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  people: getPeople(state),
  companies: getCompanies(state),
  missions: getVisibleMissions(state),
  spotlight: getSpotlight(state),
  sort: getSort(state),
});

const actions = { sortMissions, spotlightMissions, deleteMission };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onFilterChange: ({ spotlightMissions }) => event =>
      spotlightMissions(event.target.value),
  }),
);

export default enhance(Missions);
