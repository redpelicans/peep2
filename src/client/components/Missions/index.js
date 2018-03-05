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
import { LinkButton, Container, Title, Spacer, Search } from '../widgets';
import { getPathByName } from '../../routes';
import List from './List';

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
            filter={filter}
            onChange={onFilterChange}
            resetValue={() => filterMissionsList('')}
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
                  onClick={() => sortMissionsList('name')}
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
                  onClick={() => sortMissionsList('startDate')}
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
                  onClick={() => sortMissionsList('endDate')}
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
