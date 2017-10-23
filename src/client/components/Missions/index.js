import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';

import { getPeople } from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import {
  getFilter,
  getSort,
  getVisibleMissions,
} from '../../selectors/missions';
import {
  deleteMission,
  sortMissionsList,
  filterMissionsList,
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
  filter,
  sort,
  deleteMission,
  filterMissionsList,
  onFilterChange,
  sortMissionsList,
}) => (
  <Container>
    <Header>
      <HeaderLeft>
        <div className="pt-icon-standard pt-icon-shopping-cart" />
        <Spacer />
        <Title title="Missions" />
      </HeaderLeft>
      <HeaderRight>
        <Search
          filter={filter}
          onChange={onFilterChange}
          resetValue={() => filterMissionsList('')}
        />
        <Spacer />
        <SortMenu
          sortTypes={sortTypes}
          onClick={sortMissionsList}
          sort={sort}
        />
        <Spacer />
        <LinkButton to={getPathByName('addMission')} iconName="plus" />
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

Missions.propTypes = {
  people: PropTypes.object,
  companies: PropTypes.object,
  missions: PropTypes.array,
  filter: PropTypes.string,
  sort: PropTypes.object,
  deleteMission: PropTypes.func.isRequired,
  filterMissionsList: PropTypes.func.isRequired,
  sortMissionsList: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  people: getPeople(state),
  companies: getCompanies(state),
  missions: getVisibleMissions(state),
  filter: getFilter(state),
  sort: getSort(state),
});

const actions = { sortMissionsList, filterMissionsList, deleteMission };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onFilterChange: ({ filterMissionsList }) => event =>
      filterMissionsList(event.target.value),
  }),
);

export default enhance(Missions);
