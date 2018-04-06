import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';
import { Menu, MenuDivider } from '@blueprintjs/core';
import { getPeople } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import {
  getFilter,
  getSpotlight,
  getSort,
  getVisibleMissions,
} from '../../selectors/missions';
import {
  deleteMission,
  sortMissions,
  spotlightMissions,
  filterMissions,
} from '../../actions/missions';
import { Header, HeaderRight, HeaderLeft } from '../Header';
import { LinkButton, Container, Title, Spacer, Search } from '../widgets';
import {
  ContextMenu,
  ContextFilter,
  ContextSort,
} from '../widgets/ContextMenu';
import { getPathByName } from '../../routes';
import List from './List';

export const filterItems = [
  { label: 'all', text: 'All' },
  { label: 'current', text: 'Current' },
  { label: 'past', text: 'Past' },
];

export const sortItems = [
  { label: 'name', text: 'Name' },
  { label: 'startDate', text: 'Start Date' },
  { label: 'endDate', text: 'End Date' },
];

export const Missions = ({
  people,
  companies,
  missions,
  filter,
  spotlight,
  sort,
  deleteMission,
  filterMissions,
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
          <ContextMenu
            content={
              <Menu>
                <MenuDivider title="Missions" />
                <LinkButton
                  className="pt-minimal"
                  to={getPathByName('addMission')}
                  icon="pt-icon-add"
                  text="Add"
                />
                <ContextFilter
                  currentFilter={filter}
                  filterItems={filterItems}
                  setFilter={filterMissions}
                />
                <ContextSort
                  currentSort={sort}
                  sortItems={sortItems}
                  setSort={sortMissions}
                />
              </Menu>
            }
          />
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
  filter: PropTypes.string,
  spotlight: PropTypes.string,
  sort: PropTypes.object,
  deleteMission: PropTypes.func.isRequired,
  filterMissions: PropTypes.func.isRequired,
  spotlightMissions: PropTypes.func.isRequired,
  sortMissions: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  people: getPeople(state),
  companies: getCompanies(state),
  missions: getVisibleMissions(state),
  filter: getFilter(state),
  spotlight: getSpotlight(state),
  sort: getSort(state),
});

const actions = {
  filterMissions,
  sortMissions,
  spotlightMissions,
  deleteMission,
};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onFilterChange: ({ spotlightMissions }) => event =>
      spotlightMissions(event.target.value),
  }),
);

export default enhance(Missions);
