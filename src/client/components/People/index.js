import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers, lifecycle } from 'recompose';
import {
  getVisiblePeople,
  getFilter,
  getSort,
  getGroupedTagsByCount,
} from '../../selectors/people';
import { getCompanies } from '../../selectors/companies';
import List from './List';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import {
  Container,
  Search,
  Spacer,
  Title,
  LinkButton,
  SortMenu,
  TagsMenu,
} from '../widgets';
import { onTagClick, deletePeople, sortPeopleList } from '../../actions/people';

const sortTypes = [
  { key: 'name', label: 'Sort by name' },
  { key: 'createdAt', label: 'Sort by creation date' },
  { key: 'updatedAt', label: 'Sort by updated date' },
];

export const People = ({
  people,
  tags,
  companies,
  onTagClick,
  onFilterChange,
  filter = '',
  deletePeople,
  sort,
  sortPeopleList,
}) => (
  <Container>
    <Header>
      <HeaderLeft>
        <div className="pt-icon-standard pt-icon-home" />
        <Spacer />
        <Title title="People" />
      </HeaderLeft>
      <HeaderRight>
        <Search
          filter={filter}
          onChange={onFilterChange}
          resetValue={() => onTagClick('')}
        />
        <Spacer />
        <TagsMenu tags={tags} onClick={onTagClick} filter={filter} />
        <Spacer />
        <SortMenu sortTypes={sortTypes} onClick={sortPeopleList} sort={sort} />
        <Spacer />
        <LinkButton to="/people/add" iconName="plus" />
      </HeaderRight>
    </Header>
    <List
      people={people}
      companies={companies}
      onTagClick={onTagClick}
      deletePeople={deletePeople}
    />
  </Container>
);

People.propTypes = {
  people: PropTypes.array.isRequired,
  tags: PropTypes.array,
  companies: PropTypes.object.isRequired,
  onTagClick: PropTypes.func.isRequired,
  filter: PropTypes.string,
  deletePeople: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  sort: PropTypes.object,
  sortPeopleList: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  people: getVisiblePeople(state),
  tags: getGroupedTagsByCount(state),
  companies: getCompanies(state),
  filter: getFilter(state),
  sort: getSort(state),
});

const actions = { onTagClick, deletePeople, sortPeopleList };
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const componentLifecycle = {
  componentWillMount() {
    const { sortPeopleList } = this.props;
    sortPeopleList('name', true);
  },
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onFilterChange: ({ onTagClick }) => event => onTagClick(event.target.value),
  }),
  lifecycle(componentLifecycle),
);

export default enhance(People);
