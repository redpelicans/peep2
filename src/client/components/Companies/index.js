import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withHandlers } from 'recompose';
import {
  getVisibleCompanies,
  getFilter,
  getSort,
  getGroupedTagsByCount,
} from '../../selectors/companies';
import { List } from './List';
import { Header, HeaderLeft, HeaderRight } from '../Header';
import {
  Container,
  Search,
  SortMenu,
  Title,
  Spacer,
  LinkButton,
  FilterMenu,
} from '../widgets';
import {
  togglePreferredFilter,
  togglePreferred,
  filterCompanyList,
  sortCompanyList,
  deleteCompany,
} from '../../actions/companies';
import { getPathByName } from '../../routes';

const sortTypes = [
  { key: 'name', label: 'Sort by name' },
  { key: 'createdAt', label: 'Sort by creation date' },
  { key: 'updatedAt', label: 'Sort by updated date' },
];

export const Companies = ({
  companies,
  filter,
  sort,
  sortCompanyList,
  filterCompanyList,
  handleFilterChange,
  tags,
  deleteCompany,
}) => (
  <Container>
    <Header>
      <HeaderLeft>
        <div className="pt-icon-standard pt-icon-home" />
        <Spacer />
        <Title title="Companies" />
      </HeaderLeft>
      <HeaderRight>
        <Search
          filter={filter}
          onChange={handleFilterChange}
          resetValue={() => filterCompanyList('')}
        />
        <Spacer />
        <FilterMenu
          items={tags}
          title="Tags"
          identifier="#"
          onClick={filterCompanyList}
          filter={filter}
        />
        <Spacer size="5" />
        <SortMenu sortTypes={sortTypes} onClick={sortCompanyList} sort={sort} />
        <Spacer size="5" />
        <LinkButton to={getPathByName('addCompany')} iconName="plus" />
      </HeaderRight>
    </Header>
    <List
      companies={companies}
      filterCompanyList={filterCompanyList}
      deleteCompany={deleteCompany}
    />
  </Container>
);

Companies.propTypes = {
  companies: PropTypes.array.isRequired,
  tags: PropTypes.array,
  filter: PropTypes.string,
  filterCompanyList: PropTypes.func.isRequired,
  sortCompanyList: PropTypes.func.isRequired,
  sort: PropTypes.object,
  handleFilterChange: PropTypes.func.isRequired,
  deleteCompany: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  companies: getVisibleCompanies(state),
  tags: getGroupedTagsByCount(state),
  filter: getFilter(state),
  sort: getSort(state),
});

const actions = {
  filterCompanyList,
  sortCompanyList,
  togglePreferred,
  togglePreferredFilter,
  deleteCompany,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleFilterChange: ({ filterCompanyList }) => event =>
      filterCompanyList(event.target.value),
  }),
);

export default enhance(Companies);
