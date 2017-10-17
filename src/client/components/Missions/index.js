import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';

import { getMissions } from '../../selectors/missions';
import { Header, HeaderRight, HeaderLeft } from '../Header';
import {
  LinkButton,
  Container,
  Title,
  Spacer,
  Search,
  SortMenu,
} from '../widgets';

const sortTypes = [
  { key: 'name', label: 'Sort by name' },
  { key: 'createdAt', label: 'Sort by creation date' },
  { key: 'updatedAt', label: 'Sort by updated date' },
];

export const Missions = ({ missions, filter = '' }) => (
  <Container>
    <Header>
      <HeaderLeft>
        <div className="pt-icon-standard pt-icon-shopping-cart" />
        <Spacer />
        <Title title="Missions" />
      </HeaderLeft>
      <HeaderRight>
        <Search filter={filter} onChange={filter} resetValue={() => filter} />
        <Spacer />
        <SortMenu sortTypes={sortTypes} onClick={filter} sort={filter} />
        <Spacer />
        <LinkButton to="/missions/add" iconName="plus" />
      </HeaderRight>
    </Header>
  </Container>
);

Missions.propTypes = {
  missions: PropTypes.object.isRequired,
  filter: PropTypes.string,
};

const mapStateToProps = state => ({
  missions: getMissions(state),
});

const actions = {};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(Missions);
